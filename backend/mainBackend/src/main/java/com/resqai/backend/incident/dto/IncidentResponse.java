package com.resqai.backend.incident.dto;

import com.resqai.backend.incident.Incident;
import com.resqai.backend.incident.IncidentSeverity;
import com.resqai.backend.incident.IncidentStatus;
import com.resqai.backend.incident.IncidentType;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record IncidentResponse(
        UUID id, IncidentType type, IncidentSeverity severity, IncidentStatus status,
        String description, Double latitude, Double longitude, String locationLabel,
        Integer affectedCount, List<String> needs, int priorityScore,
        String reportedByName, Instant createdAt, Instant updatedAt) {

    public static IncidentResponse from(Incident i, int priorityScore) {
        return new IncidentResponse(i.getId(), i.getType(), i.getSeverity(), i.getStatus(),
                i.getDescription(), i.getLatitude(), i.getLongitude(), i.getLocationLabel(),
                i.getAffectedCount(), i.getNeeds(), priorityScore,
                i.getReportedBy() == null ? null : i.getReportedBy().getName(),
                i.getCreatedAt(), i.getUpdatedAt());
    }
}