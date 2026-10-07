package com.resqai.backend.incident.dto;

import com.resqai.backend.incident.IncidentSeverity;
import com.resqai.backend.incident.IncidentType;
import jakarta.validation.constraints.*;
import java.util.List;

public record IncidentRequest(
        @NotNull IncidentType type,
        @NotNull IncidentSeverity severity,
        @NotBlank @Size(max = 2000) String description,
        @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,
        @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude,
        String locationLabel,
        @Min(0) Integer affectedCount,
        List<String> needs) {
}