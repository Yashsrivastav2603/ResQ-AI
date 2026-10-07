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
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/**
 * GDACS (Global Disaster Alert and Coordination System) multi-hazard feed:
 * earthquakes, cyclones, floods, volcanoes, droughts and wildfires with an
 * official Green/Orange/Red alert level. Free, no API key.
 *
 * GDACS has no radius parameter, so we pull the global window and filter by
 * haversine distance from the user's registered coordinates.
 *
 * Attribution required: "Global Disaster Alert and Coordination System, GDACS".
 */
@Component
public class GdacsProvider implements DisasterEventProvider {

    private static final int LIVE_WINDOW_DAYS = 7;

    private final RestClient restClient;
    private final NewsProperties props;

    public GdacsProvider(RestClient externalRestClient, NewsProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    @Override
    public String name() {
        return "GDACS";
    }

    @Override
    public boolean isEnabled() {
        return props.gdacs().enabled();
    }

    @Override
    public List<DisasterEvent> fetchLive(FeedQuery query) {
        return fetch(query, LIVE_WINDOW_DAYS, true);
    }

    @Override
    public List<DisasterEvent> fetchHistory(FeedQuery query) {
        return fetch(query, query.historyDays(), false);
    }

    private List<DisasterEvent> fetch(FeedQuery query, int days, boolean onlyCurrent) {
        LocalDate to = LocalDate.now(ZoneOffset.UTC);
        LocalDate from = to.minusDays(Math.max(1, days));

        String url = UriComponentsBuilder.fromHttpUrl(props.gdacs().baseUrl())
                .queryParam("eventlist", props.gdacs().eventTypes())
                .queryParam("alertlevel", props.gdacs().alertLevels())
                .queryParam("fromdate", from.toString())
                .queryParam("todate", to.toString())
                .queryParam("pagesize", 100)
                .queryParam("pagenumber", 1)
                .build(true)
                .toUriString();

        JsonNode root = restClient.get().uri(url).retrieve().body(JsonNode.class);
        List<DisasterEvent> events = new ArrayList<>();
        if (root == null) {
            return events;
        }

        Instant liveCutoff = Instant.now().minus(Duration.ofDays(LIVE_WINDOW_DAYS));

        for (JsonNode feature : root.path("features")) {
            JsonNode p = feature.path("properties");
            JsonNode coords = feature.path("geometry").path("coordinates");
            if (!coords.isArray() || coords.size() < 2) {
                continue;
            }
            double lon = coords.get(0).asDouble();
            double lat = coords.get(1).asDouble();

            double distance = GeoUtils.haversineKm(query.latitude(), query.longitude(), lat, lon);
            if (distance > query.radiusKm()) {
                continue;
            }

            boolean current = "true".equalsIgnoreCase(JsonSupport.text(p, "iscurrent"));
            Instant start = JsonSupport.parseInstant(JsonSupport.text(p, "fromdate"));
            Instant end = JsonSupport.parseInstant(JsonSupport.text(p, "todate"));

            boolean live = current || (end != null && end.isAfter(liveCutoff));
            if (onlyCurrent && !live) {
                continue;
            }

            JsonNode severityNode = p.path("severitydata");
            JsonNode urlNode = p.path("url");

            String eventType = JsonSupport.text(p, "eventtype");
            String name = JsonSupport.text(p, "eventname");
            String description = JsonSupport.plainText(
                    firstNonNull(JsonSupport.text(p, "description"),
                            JsonSupport.text(p, "htmldescription")), 400);

            events.add(DisasterEvent.builder()
                    .id("gdacs:" + eventType + ":" + JsonSupport.text(p, "eventid"))
                    .source(name())
                    .type(DisasterType.fromGdacs(eventType))
                    .title(firstNonNull(name, description, eventType))
                    .description(description)
                    .severity(Severity.fromAlertLevel(JsonSupport.text(p, "alertlevel")))
                    .status(live ? EventStatus.LIVE : EventStatus.PAST)
                    .latitude(lat)
                    .longitude(lon)
                    .distanceKm(distance)
                    .place(JsonSupport.text(p, "country"))
                    .country(JsonSupport.text(p, "country"))
                    .magnitude(JsonSupport.number(severityNode, "severity"))
                    .magnitudeUnit(JsonSupport.text(severityNode, "severityunit"))
                    .startedAt(start)
                    .endedAt(live ? null : end)
                    .updatedAt(end)
                    .url(firstNonNull(JsonSupport.text(urlNode, "report"), JsonSupport.text(p, "url")))
                    .iconUrl(JsonSupport.text(p, "icon"))
                    .build());
        }
        return events;
    }

    private static String firstNonNull(String... values) {
        for (String v : values) {
            if (v != null && !v.isBlank()) {
                return v;
            }
        }
        return null;
    }
}
