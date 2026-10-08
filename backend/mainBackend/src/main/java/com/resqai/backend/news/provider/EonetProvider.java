package com.resqai.backend.news.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.resqai.backend.common.GeoUtils;
import com.resqai.backend.config.NewsProperties;
import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.DisasterEvent;
import com.resqai.backend.news.model.DisasterType;
import com.resqai.backend.news.model.EventStatus;
import com.resqai.backend.news.model.Severity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * NASA EONET v3: open natural events (wildfires, severe storms, volcanoes,
 * floods, landslides). Free, no API key. Supplies the "currently open" signal
 * the Disaster News live section needs for slow-burning hazards that GDACS
 * only reports once they cross an alert threshold.
 *
 * EONET takes a bbox in (minLon, maxLat, maxLon, minLat) order.
 */
@Component
public class EonetProvider implements DisasterEventProvider {

    private final RestClient restClient;
    private final NewsProperties props;

    public EonetProvider(RestClient externalRestClient, NewsProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    @Override
    public String name() {
        return "NASA EONET";
    }

    @Override
    public boolean isEnabled() {
        return props.eonet().enabled();
    }

    @Override
    public List<DisasterEvent> fetchLive(FeedQuery query) {
        return fetch(query, "open", 30);
    }

    @Override
    public List<DisasterEvent> fetchHistory(FeedQuery query) {
        return fetch(query, "closed", query.historyDays());
    }

    private List<DisasterEvent> fetch(FeedQuery query, String status, int days) {
        double[] box = GeoUtils.boundingBox(query.latitude(), query.longitude(), query.radiusKm());
        // box = [minLat, minLon, maxLat, maxLon]; EONET wants minLon,maxLat,maxLon,minLat
        String bbox = box[1] + "," + box[2] + "," + box[3] + "," + box[0];

        String url = UriComponentsBuilder.fromHttpUrl(props.eonet().baseUrl())
                .queryParam("status", status)
                .queryParam("days", Math.max(1, Math.min(days, 365)))
                .queryParam("bbox", bbox)
                .queryParam("limit", 100)
                .build(true)
                .toUriString();

        JsonNode root = restClient.get().uri(url).retrieve().body(JsonNode.class);
        List<DisasterEvent> events = new ArrayList<>();
        if (root == null) {
            return events;
        }

        for (JsonNode event : root.path("events")) {
            JsonNode geometries = event.path("geometry");
            if (!geometries.isArray() || geometries.isEmpty()) {
                continue;
            }
            JsonNode latest = geometries.get(geometries.size() - 1);
            double[] point = centroid(latest.path("coordinates"));
            if (point == null) {
                continue;
            }
            double distance = GeoUtils.haversineKm(query.latitude(), query.longitude(), point[0], point[1]);
            if (distance > query.radiusKm()) {
                continue;
            }

            String categoryId = event.path("categories").isArray() && !event.path("categories").isEmpty()
                    ? JsonSupport.text(event.path("categories").get(0), "id")
                    : null;
            boolean closed = event.hasNonNull("closed");
            Instant start = JsonSupport.parseInstant(JsonSupport.text(geometries.get(0), "date"));
            Instant updated = JsonSupport.parseInstant(JsonSupport.text(latest, "date"));

            events.add(DisasterEvent.builder()
                    .id("eonet:" + JsonSupport.text(event, "id"))
                    .source(name())
                    .type(DisasterType.fromEonetCategory(categoryId))
                    .title(JsonSupport.text(event, "title"))
                    .description(JsonSupport.plainText(JsonSupport.text(event, "description"), 400))
                    .severity(closed ? Severity.GREEN : Severity.ORANGE)
                    .status(closed ? EventStatus.PAST : EventStatus.LIVE)
                    .latitude(point[0])
                    .longitude(point[1])
                    .distanceKm(distance)
                    .startedAt(start)
                    .endedAt(closed ? JsonSupport.parseInstant(JsonSupport.text(event, "closed")) : null)
                    .updatedAt(updated)
                    .url(JsonSupport.text(event, "link"))
                    .build());
        }
        return events;
    }

    /** EONET geometries are Point [lon,lat] or Polygon [[[lon,lat],...]]. Returns [lat, lon]. */
    private double[] centroid(JsonNode coordinates) {
        if (coordinates == null || !coordinates.isArray() || coordinates.isEmpty()) {
            return null;
        }
        if (coordinates.get(0).isNumber()) {
            return new double[]{coordinates.get(1).asDouble(), coordinates.get(0).asDouble()};
        }
        double latSum = 0;
        double lonSum = 0;
        int count = 0;
        for (JsonNode ring : coordinates) {
            for (JsonNode pair : ring) {
                if (pair.isArray() && pair.size() >= 2) {
                    lonSum += pair.get(0).asDouble();
                    latSum += pair.get(1).asDouble();
                    count++;
                }
            }
        }
        return count == 0 ? null : new double[]{latSum / count, lonSum / count};
    }
}
