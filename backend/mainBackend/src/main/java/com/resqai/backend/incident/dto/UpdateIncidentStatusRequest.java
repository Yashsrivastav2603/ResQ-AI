package com.resqai.backend.incident.dto;

import com.resqai.backend.incident.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateIncidentStatusRequest(@NotNull IncidentStatus status) {
}