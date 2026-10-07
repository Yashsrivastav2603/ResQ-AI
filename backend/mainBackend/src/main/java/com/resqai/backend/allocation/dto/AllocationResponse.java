package com.resqai.backend.allocation.dto;

import com.resqai.backend.allocation.Allocation;
import com.resqai.backend.allocation.AllocationStatus;
import java.time.Instant;
import java.util.UUID;

public record AllocationResponse(
        UUID id, UUID incidentId, UUID resourceId, String resourceName, String resourceType,
        AllocationStatus status, String decidedByName, String notes,
        Instant createdAt, Instant updatedAt) {

    public static AllocationResponse from(Allocation a) {
        return new AllocationResponse(
                a.getId(), a.getIncident().getId(), a.getResource().getId(),
                a.getResource().getName(), a.getResource().getType().name(),
                a.getStatus(), a.getDecidedBy() == null ? null : a.getDecidedBy().getName(),
                a.getNotes(), a.getCreatedAt(), a.getUpdatedAt());
    }
}