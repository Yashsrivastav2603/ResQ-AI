package com.resqai.backend.resource.discovery;

import com.fasterxml.jackson.databind.JsonNode;
import com.resqai.backend.common.GeoUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

/**
 * Finds real hospitals, police stations, fire stations and NGOs near a point
 * via OpenStreetMap's Overpass API. Free, no key, live data — same RestClient
 * pattern as every other provider in this codebase.
 */
@Component
public class OverpassProvider {

    private static final String OVERPASS_URL = "https://overpass-api.de/api/interpreter";

    private final RestClient restClient;

    public OverpassProvider(RestClient externalRestClient) {
        this.restClient = externalRestClient;
    }

    public List<DiscoveredFacility> findNearby(double lat, double lon, int radiusMeters) {
        String query = String.format(
                "[out:json][timeout:20];(" +
                        "node[\"amenity\"=\"hospital\"](around:%d,%f,%f);" +
                        "node[\"amenity\"=\"police\"](around:%d,%f,%f);" +
                        "node[\"amenity\"=\"fire_station\"](around:%d,%f,%f);" +
                        "node[\"office\"=\"ngo\"](around:%d,%f,%f);" +
                        "node[\"social_facility\"](around:%d,%f,%f);" +
                        ");out body;",
                radiusMeters, lat, lon, radiusMeters, lat, lon, radiusMeters, lat, lon,
                radiusMeters, lat, lon, radiusMeters, lat, lon);

        JsonNode root = restClient.post()
                .uri(OVERPASS_URL)
                .headers(h -> h.setContentType(MediaType.APPLICATION_FORM_URLENCODED))
                .body("data=" + query)
                .retrieve()
                .body(JsonNode.class);

        List<DiscoveredFacility> results = new ArrayList<>();
        if (root == null) return results;

        for (JsonNode el : root.path("elements")) {
            double elLat = el.path("lat").asDouble();
            double elLon = el.path("lon").asDouble();
            JsonNode tags = el.path("tags");

            String category = tags.has("amenity") ? tags.path("amenity").asText()
                    : tags.has("office") ? "ngo"
                    : tags.has("social_facility") ? "social_facility" : "unknown";

            results.add(new DiscoveredFacility(
                    el.path("id").asLong(),
                    tags.path("name").asText(category.toUpperCase() + " (unnamed)"),
                    category,
                    elLat, elLon,
                    GeoUtils.haversineKm(lat, lon, elLat, elLon),
                    buildAddress(tags),
                    tags.path("phone").asText(tags.path("contact:phone").asText(null))));
        }
        results.sort((a, b) -> Double.compare(a.distanceKm(), b.distanceKm()));
        return results;
    }

    private String buildAddress(JsonNode tags) {
        String street = tags.path("addr:street").asText("");
        String city = tags.path("addr:city").asText("");
        if (street.isBlank() && city.isBlank()) return null;
        return (street + " " + city).trim();
    }
}