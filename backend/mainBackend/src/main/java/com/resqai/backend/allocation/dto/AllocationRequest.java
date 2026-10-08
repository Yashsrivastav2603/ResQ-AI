package com.resqai.backend.allocation.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AllocationRequest(
        @NotNull UUID incidentId,
        @NotNull UUID resourceId,
        String notes) {
}