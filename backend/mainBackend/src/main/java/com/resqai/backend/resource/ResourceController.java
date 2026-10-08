package com.resqai.backend.resource;

import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.common.exception.BadRequestException;
import com.resqai.backend.resource.discovery.DiscoveredFacility;
import com.resqai.backend.resource.discovery.OverpassProvider;
import com.resqai.backend.resource.dto.ResourceRequest;
import com.resqai.backend.resource.dto.ResourceResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resources")
@Tag(name = "Resources")
public class ResourceController {

    private final ResourceService service;
    private final OverpassProvider overpassProvider;

    public ResourceController(ResourceService service, OverpassProvider overpassProvider) {
        this.service = service;
        this.overpassProvider = overpassProvider;
    }

    @GetMapping("/discover")
    @Operation(summary = "Live lookup of real nearby hospitals, police, fire stations and NGOs via OpenStreetMap")
    public ResponseEntity<ApiResponse<List<DiscoveredFacility>>> discover(
            @RequestParam double lat, @RequestParam double lon,
            @RequestParam(defaultValue = "10000") int radiusMeters) {
        return ResponseEntity.ok(ApiResponse.ok(overpassProvider.findNearby(lat, lon, radiusMeters)));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Nearest resources of a type within a radius (e.g. find nearby shelters)")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> nearby(
            @RequestParam ResourceType type, @RequestParam double lat, @RequestParam double lon,
            @RequestParam(defaultValue = "25") double radiusKm,
            @RequestParam(defaultValue = "true") boolean onlyAvailable) {
        if (radiusKm <= 0 || radiusKm > 500) {
            throw new BadRequestException("radiusKm must be between 0 and 500");
        }
        List<ResourceResponse> results = service.nearby(type, lat, lon, radiusKm, onlyAvailable).stream()
                .map(m -> ResourceResponse.withDistance(m.resource(), m.distanceKm()))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping
    @Operation(summary = "List resources, optionally filtered by type or status")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> list(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceResponse> results = service.list(type, status).stream()
                .map(ResourceResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RESPONDER', 'COMMANDER', 'ADMIN')")
    @Operation(summary = "Register a new resource (RESPONDER/COMMANDER/ADMIN)")
    public ResponseEntity<ApiResponse<ResourceResponse>> create(@Valid @RequestBody ResourceRequest request) {
        Resource created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Resource created", ResourceResponse.from(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESPONDER', 'COMMANDER', 'ADMIN')")
    @Operation(summary = "Update a resource's status/location/capacity")
    public ResponseEntity<ApiResponse<ResourceResponse>> update(
            @PathVariable UUID id, @Valid @RequestBody ResourceRequest request) {
        Resource updated = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Resource updated", ResourceResponse.from(updated)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMMANDER', 'ADMIN')")
    @Operation(summary = "Remove a resource (COMMANDER/ADMIN)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted", null));
    }
}