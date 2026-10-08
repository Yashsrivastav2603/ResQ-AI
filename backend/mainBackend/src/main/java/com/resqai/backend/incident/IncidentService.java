package com.resqai.backend.incident;

import com.resqai.backend.common.exception.ResourceNotFoundException;
import com.resqai.backend.incident.dto.IncidentRequest;
import com.resqai.backend.notification.NotificationService;
import com.resqai.backend.notification.NotificationType;
import com.resqai.backend.user.Role;
import com.resqai.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository repository;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Incident report(IncidentRequest request, User reporter) {
        Incident incident = new Incident();
        incident.setType(request.type());
        incident.setSeverity(request.severity());
        incident.setDescription(request.description());
        incident.setLatitude(request.latitude());
        incident.setLongitude(request.longitude());
        incident.setLocationLabel(request.locationLabel());
        incident.setAffectedCount(request.affectedCount());
        if (request.needs() != null) {
            incident.setNeeds(request.needs());
        }
        incident.setReportedBy(reporter);

        Incident saved = repository.save(incident);

        notificationService.notifyRoles(List.of(Role.RESPONDER, Role.COMMANDER, Role.ADMIN),
                NotificationType.INCIDENT_REPORTED,
                "New incident reported: " + saved.getType(),
                saved.getDescription(),
                saved.getId());

        notificationService.notifyUser(reporter,
                NotificationType.INCIDENT_REPORTED,
                "Your report was received",
                "We've received your " + saved.getType() + " report and notified response teams.",
                saved.getId());

        return saved;
    }

    @Transactional
    public Incident updateStatus(UUID id, IncidentStatus status) {
        Incident incident = require(id);
        incident.setStatus(status);
        return repository.save(incident);
    }

    @Transactional(readOnly = true)
    public Incident require(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<Incident> list(IncidentStatus status, IncidentSeverity severity) {
        if (status != null) return repository.findByStatus(status);
        if (severity != null) return repository.findBySeverity(severity);
        return repository.findAll();
    }

    public int priorityScore(Incident incident) {
        int base = switch (incident.getSeverity()) {
            case CRITICAL -> 85;
            case HIGH -> 65;
            case MEDIUM -> 45;
            case LOW -> 25;
        };
        int affected = incident.getAffectedCount() == null ? 0 : incident.getAffectedCount();
        int boost = Math.min(15, affected / 10);
        return Math.min(100, base + boost);
    }
}