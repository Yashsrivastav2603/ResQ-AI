package com.resqai.backend.allocation;

import com.resqai.backend.common.exception.BadRequestException;
import com.resqai.backend.common.exception.ResourceNotFoundException;
import com.resqai.backend.incident.Incident;
import com.resqai.backend.incident.IncidentRepository;
import com.resqai.backend.incident.IncidentStatus;
import com.resqai.backend.notification.NotificationService;
import com.resqai.backend.notification.NotificationType;
import com.resqai.backend.resource.Resource;
import com.resqai.backend.resource.ResourceRepository;
import com.resqai.backend.resource.ResourceStatus;
import com.resqai.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.List;
import java.util.UUID;

@Service
public class AllocationService {

    private static final Map<AllocationStatus, AllocationStatus> NEXT_STEP = java.util.Map.of(
            AllocationStatus.PENDING, AllocationStatus.APPROVED,
            AllocationStatus.APPROVED, AllocationStatus.DISPATCHED,
            AllocationStatus.DISPATCHED, AllocationStatus.ON_SCENE,
            AllocationStatus.ON_SCENE, AllocationStatus.COMPLETED);

    private final AllocationRepository repository;
    private final IncidentRepository incidentRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public AllocationService(AllocationRepository repository, IncidentRepository incidentRepository,
                             ResourceRepository resourceRepository, NotificationService notificationService) {
        this.repository = repository;
        this.incidentRepository = incidentRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Allocation create(UUID incidentId, UUID resourceId, String notes) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + incidentId + " not found"));
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource " + resourceId + " not found"));

        if (resource.getStatus() != ResourceStatus.AVAILABLE) {
            throw new BadRequestException("Resource " + resource.getName() + " is not available");
        }

        Allocation allocation = new Allocation();
        allocation.setIncident(incident);
        allocation.setResource(resource);
        allocation.setNotes(notes);
        allocation = repository.save(allocation);

        resource.setStatus(ResourceStatus.ASSIGNED);
        resourceRepository.save(resource);

        incident.setStatus(IncidentStatus.ALLOCATED);
        incidentRepository.save(incident);

        notificationService.notifyUser(incident.getReportedBy(),
                NotificationType.ALLOCATION_CREATED,
                "Help is on the way",
                resource.getName() + " has been assigned to your report.",
                incident.getId());

        return allocation;
    }

    @Transactional
    public Allocation advance(UUID id, User decidedBy, String notes) {
        Allocation allocation = require(id);
        AllocationStatus next = NEXT_STEP.get(allocation.getStatus());
        if (next == null) {
            throw new BadRequestException(
                    "Allocation is already " + allocation.getStatus() + " and cannot move forward further");
        }
        applyStatus(allocation, next, decidedBy, notes);
        return allocation;
    }

    @Transactional
    public Allocation reject(UUID id, User decidedBy, String notes) {
        Allocation allocation = require(id);
        if (allocation.getStatus() != AllocationStatus.PENDING) {
            throw new BadRequestException("Only a pending allocation can be rejected");
        }
        applyStatus(allocation, AllocationStatus.REJECTED, decidedBy, notes);

        Resource resource = allocation.getResource();
        resource.setStatus(ResourceStatus.AVAILABLE);
        resourceRepository.save(resource);
        return allocation;
    }

    private void applyStatus(Allocation allocation, AllocationStatus status, User decidedBy, String notes) {
        allocation.setStatus(status);
        allocation.setDecidedBy(decidedBy);
        if (notes != null && !notes.isBlank()) {
            allocation.setNotes(notes);
        }
        repository.save(allocation);

        notificationService.notifyUser(allocation.getIncident().getReportedBy(),
                NotificationType.ALLOCATION_STATUS_CHANGED,
                "Your report status: " + status,
                "Resource " + allocation.getResource().getName() + " is now " + status,
                allocation.getIncident().getId());

        if (status == AllocationStatus.COMPLETED) {
            Resource resource = allocation.getResource();
            resource.setStatus(ResourceStatus.AVAILABLE);
            resourceRepository.save(resource);

            Incident incident = allocation.getIncident();
            incident.setStatus(IncidentStatus.RESOLVED);
            incidentRepository.save(incident);
        }
    }

    @Transactional(readOnly = true)
    public Allocation require(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<Allocation> forIncident(UUID incidentId) {
        return repository.findByIncidentId(incidentId);
    }

    @Transactional(readOnly = true)
    public List<Allocation> list(AllocationStatus status) {
        return status != null ? repository.findByStatus(status) : repository.findAll();
    }
}