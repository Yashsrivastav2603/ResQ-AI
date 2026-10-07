package com.resqai.backend.allocation;

import com.resqai.backend.allocation.dto.AllocationRequest;
import com.resqai.backend.allocation.dto.AllocationResponse;
import com.resqai.backend.allocation.dto.UpdateAllocationStatusRequest;
import com.resqai.backend.common.ApiResponse;
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
@RequestMapping("/api/v1/allocations")
@PreAuthorize("hasAnyRole('RESPONDER', 'COMMANDER', 'ADMIN')")
@Tag(name = "Allocations")
public class AllocationController {

    private final AllocationService service;
    private final UserService userService;

    public AllocationController(AllocationService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Create a pending allocation linking an incident to a resource")
    public ResponseEntity<ApiResponse<AllocationResponse>> create(@Valid @RequestBody AllocationRequest request) {
        Allocation created = service.create(request.incidentId(), request.resourceId(), request.notes());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Allocation created", AllocationResponse.from(created)));
    }

    @PatchMapping("/{id}/advance")
    @Operation(summary = "Move the allocation to its next workflow stage")
    public ResponseEntity<ApiResponse<AllocationResponse>> advance(
            @CurrentUser AuthenticatedUser principal, @PathVariable UUID id,
            @RequestBody(required = false) UpdateAllocationStatusRequest request) {
        User decidedBy = userService.require(principal.getId());
        String notes = request == null ? null : request.notes();
        Allocation updated = service.advance(id, decidedBy, notes);
        return ResponseEntity.ok(ApiResponse.ok("Allocation advanced", AllocationResponse.from(updated)));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject a pending allocation")
    public ResponseEntity<ApiResponse<AllocationResponse>> reject(
            @CurrentUser AuthenticatedUser principal, @PathVariable UUID id,
            @RequestBody(required = false) UpdateAllocationStatusRequest request) {
        User decidedBy = userService.require(principal.getId());
        String notes = request == null ? null : request.notes();
        Allocation updated = service.reject(id, decidedBy, notes);
        return ResponseEntity.ok(ApiResponse.ok("Allocation rejected", AllocationResponse.from(updated)));
    }

    @GetMapping
    @Operation(summary = "List allocations, optionally filtered by status")
    public ResponseEntity<ApiResponse<List<AllocationResponse>>> list(
            @RequestParam(required = false) AllocationStatus status) {
        List<AllocationResponse> results = service.list(status).stream()
                .map(AllocationResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/incident/{incidentId}")
    @Operation(summary = "All allocations for one incident")
    public ResponseEntity<ApiResponse<List<AllocationResponse>>> forIncident(@PathVariable UUID incidentId) {
        List<AllocationResponse> results = service.forIncident(incidentId).stream()
                .map(AllocationResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}