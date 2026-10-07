package com.resqai.backend.resource.dto;

import com.resqai.backend.resource.ResourceType;
import jakarta.validation.constraints.*;

public record ResourceRequest(
        @NotNull ResourceType type,
        @NotBlank @Size(max = 150) String name,
        @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,
        @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude,
        String address,
        @Min(0) Integer capacity,
        @Min(0) Integer currentOccupancy,
        String contactPhone) {
}