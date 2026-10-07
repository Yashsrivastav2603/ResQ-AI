package com.resqai.backend.incident;

import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.incident.dto.IncidentRequest;
import com.resqai.backend.incident.dto.IncidentResponse;
import com.resqai.backend.incident.dto.UpdateIncidentStatusRequest;
import com.resqai.backend.security.AuthenticatedUser;
import com.resqai.backend.security.CurrentUser;
import com.resqai.backend.user.User;
import com.resqai.backend.user.UserService;
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
@RequestMapping("/api/v1/incidents")
@Tag(name = "Incidents")
public class IncidentController {

    private final IncidentService service;
    private final UserService userService;

    public IncidentController(IncidentService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Report an emergency (any authenticated user)")
    public ResponseEntity<ApiResponse<IncidentResponse>> report(
            @CurrentUser AuthenticatedUser principal, @Valid @RequestBody IncidentRequest request) {
        User reporter = userService.require(principal.getId());
        Incident created = service.report(request, reporter);
        IncidentResponse response = IncidentResponse.from(created, service.priorityScore(created));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Incident reported", response));
    }

    @GetMapping
    @Operation(summary = "List incidents, optionally filtered by status or severity")
    public ResponseEntity<ApiResponse<List<IncidentResponse>>> list(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentSeverity severity) {
        List<IncidentResponse> results = service.list(status, severity).stream()
                .map(i -> IncidentResponse.from(i, service.priorityScore(i)))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get one incident by id")
    public ResponseEntity<ApiResponse<IncidentResponse>> get(@PathVariable UUID id) {
        Incident incident = service.require(id);
        return ResponseEntity.ok(ApiResponse.ok(IncidentResponse.from(incident, service.priorityScore(incident))));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RESPONDER', 'COMMANDER', 'ADMIN')")
    @Operation(summary = "Change an incident's status (RESPONDER/COMMANDER/ADMIN)")
    public ResponseEntity<ApiResponse<IncidentResponse>> updateStatus(
            @PathVariable UUID id, @Valid @RequestBody UpdateIncidentStatusRequest request) {
        Incident updated = service.updateStatus(id, request.status());
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                IncidentResponse.from(updated, service.priorityScore(updated))));
    }
}