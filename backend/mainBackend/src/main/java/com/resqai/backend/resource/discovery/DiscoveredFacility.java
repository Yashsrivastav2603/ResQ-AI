package com.resqai.backend.resource.discovery;

public record DiscoveredFacility(
        long osmId,
        String name,
        String category,
        double latitude,
        double longitude,
        double distanceKm,
        String address,
        String phone) {
}