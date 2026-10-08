package com.resqai.backend.resource;

import com.resqai.backend.common.GeoUtils;
import com.resqai.backend.common.exception.ResourceNotFoundException;
import com.resqai.backend.resource.dto.ResourceRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ResourceService {

    private final ResourceRepository repository;

    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Resource create(ResourceRequest request) {
        Resource resource = new Resource();
        apply(resource, request);
        return repository.save(resource);
    }

    @Transactional
    public Resource update(UUID id, ResourceRequest request) {
        Resource resource = require(id);
        apply(resource, request);
        return repository.save(resource);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(require(id));
    }

    @Transactional(readOnly = true)
    public Resource require(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<Resource> list(ResourceType type, ResourceStatus status) {
        if (type != null) return repository.findByType(type);
        if (status != null) return repository.findByStatus(status);
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Match> nearby(ResourceType type, double lat, double lon, double radiusKm, boolean onlyAvailable) {
        return repository.findByType(type).stream()
                .filter(r -> !onlyAvailable || r.getStatus() == ResourceStatus.AVAILABLE)
                .map(r -> new Match(r, GeoUtils.haversineKm(lat, lon, r.getLatitude(), r.getLongitude())))
                .filter(m -> m.distanceKm() <= radiusKm)
                .sorted(Comparator.comparingDouble(Match::distanceKm))
                .toList();
    }

    private void apply(Resource resource, ResourceRequest request) {
        resource.setType(request.type());
        resource.setName(request.name());
        resource.setLatitude(request.latitude());
        resource.setLongitude(request.longitude());
        resource.setAddress(request.address());
        resource.setCapacity(request.capacity());
        resource.setCurrentOccupancy(request.currentOccupancy());
        resource.setContactPhone(request.contactPhone());
    }

    public record Match(Resource resource, double distanceKm) {
    }
}