package com.resqai.backend.allocation.dto;

import com.resqai.backend.allocation.AllocationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateAllocationStatusRequest(@NotNull AllocationStatus status, String notes) {
}