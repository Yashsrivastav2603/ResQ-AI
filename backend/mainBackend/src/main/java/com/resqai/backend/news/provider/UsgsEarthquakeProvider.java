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

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * USGS FDSN event service. Supports a native circle search
 * (latitude + longitude + maxradiuskm), so the location filtering happens
 * upstream rather than in our process. Free, no API key.
 */
@Component
public class UsgsEarthquakeProvider implements DisasterEventProvider {

    /** Anything in the last 24h counts as "live" for the dashboard. */
    private static final Duration LIVE_WINDOW = Duration.ofHours(24);

    private final RestClient restClient;
    private final NewsProperties props;

    public UsgsEarthquakeProvider(RestClient externalRestClient, NewsProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    @Override
    public String name() {
        return "USGS";
    }

    @Override
    public boolean isEnabled() {
        return props.usgs().enabled();
    }

    @Override
    public List<DisasterEvent> fetchLive(FeedQuery query) {
        Instant from = Instant.now().minus(LIVE_WINDOW);
        return fetch(query, from, 0.0, EventStatus.LIVE);
    }

    @Override
    public List<DisasterEvent> fetchHistory(FeedQuery query) {
        Instant from = Instant.now().minus(Duration.ofDays(query.historyDays()));
        return fetch(query, from, props.usgs().minMagnitude(), EventStatus.PAST);
    }

    private List<DisasterEvent> fetch(FeedQuery query, Instant from, double minMagnitude,
                                      EventStatus defaultStatus) {
        String url = UriComponentsBuilder.fromHttpUrl(props.usgs().baseUrl())
                .queryParam("format", "geojson")
                .queryParam("latitude", query.latitude())
                .queryParam("longitude", query.longitude())
                .queryParam("maxradiuskm", query.radiusKm())
                .queryParam("starttime", from.toString())
                .queryParam("minmagnitude", minMagnitude)
                .queryParam("orderby", "time")
                .queryParam("limit", 200)
                .toUriString();

        JsonNode root = restClient.get().uri(url).retrieve().body(JsonNode.class);
        List<DisasterEvent> events = new ArrayList<>();
        if (root == null) {
            return events;
        }

        Instant liveCutoff = Instant.now().minus(LIVE_WINDOW);
        for (JsonNode feature : root.path("features")) {
            JsonNode p = feature.path("properties");
            JsonNode coords = feature.path("geometry").path("coordinates");
            if (!coords.isArray() || coords.size() < 2) {
                continue;
            }
            double lon = coords.get(0).asDouble();
            double lat = coords.get(1).asDouble();
            Instant time = JsonSupport.epochMillis(p, "time");
            Double magnitude = JsonSupport.number(p, "mag");

            EventStatus status = (time != null && time.isAfter(liveCutoff))
                    ? EventStatus.LIVE : defaultStatus;

            events.add(DisasterEvent.builder()
                    .id("usgs:" + feature.path("id").asText())
                    .source(name())
                    .type(DisasterType.EARTHQUAKE)
                    .title(JsonSupport.text(p, "title"))
                    .description(JsonSupport.text(p, "place"))
                    .severity(Severity.fromPager(JsonSupport.text(p, "alert"), magnitude))
                    .status(status)
                    .latitude(lat)
                    .longitude(lon)
                    .distanceKm(GeoUtils.haversineKm(query.latitude(), query.longitude(), lat, lon))
                    .place(JsonSupport.text(p, "place"))
                    .magnitude(magnitude)
                    .magnitudeUnit("M")
                    .startedAt(time)
                    .updatedAt(JsonSupport.epochMillis(p, "updated"))
                    .url(JsonSupport.text(p, "url"))
                    .build());
        }
        return events;
    }
}
