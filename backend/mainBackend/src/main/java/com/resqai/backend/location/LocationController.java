package com.resqai.backend.location;

import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.location.dto.LocationRequest;
import com.resqai.backend.location.dto.LocationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Helper endpoint the signup form calls after the browser hands over
 * coordinates, so the user sees "Lucknow, Uttar Pradesh" before submitting.
 */
@RestController
@RequestMapping("/api/v1/location")
@Tag(name = "Location")
public class LocationController {

    private final GeocodingService geocodingService;

    public LocationController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @PostMapping("/resolve")
    @Operation(summary = "Resolve coordinates or a free-text address into a full location")
    public ResponseEntity<ApiResponse<LocationResponse>> resolve(@Valid @RequestBody LocationRequest request) {
        GeoLocation resolved = geocodingService.resolve(request);
        return ResponseEntity.ok(ApiResponse.ok(LocationResponse.from(resolved)));
    }
}
