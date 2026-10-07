package com.resqai.backend.resource.dto;

import com.resqai.backend.resource.Resource;
import com.resqai.backend.resource.ResourceStatus;
import com.resqai.backend.resource.ResourceType;
import java.time.Instant;
import java.util.UUID;

public record ResourceResponse(
        UUID id, ResourceType type, String name, ResourceStatus status,
        Double latitude, Double longitude, String address,
        Integer capacity, Integer currentOccupancy, String contactPhone,
        Double distanceKm, Instant updatedAt) {

    public static ResourceResponse from(Resource r) {
        return new ResourceResponse(r.getId(), r.getType(), r.getName(), r.getStatus(),
                r.getLatitude(), r.getLongitude(), r.getAddress(), r.getCapacity(),
                r.getCurrentOccupancy(), r.getContactPhone(), null, r.getUpdatedAt());
    }

    public static ResourceResponse withDistance(Resource r, double distanceKm) {
        return new ResourceResponse(r.getId(), r.getType(), r.getName(), r.getStatus(),
                r.getLatitude(), r.getLongitude(), r.getAddress(), r.getCapacity(),
                r.getCurrentOccupancy(), r.getContactPhone(), distanceKm, r.getUpdatedAt());
    }
}