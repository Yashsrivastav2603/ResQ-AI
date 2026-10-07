package com.resqai.backend.weather;

import com.fasterxml.jackson.databind.JsonNode;
import com.resqai.backend.config.CacheConfig;
import com.resqai.backend.weather.WeatherProperties;
import com.resqai.backend.news.dto.FeedQuery;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Open-Meteo current conditions + short hourly outlook. Free, no API key.
 * Cached on the same coordinate grid as the disaster-event providers.
 */
@Component
public class OpenMeteoProvider {

    private final RestClient restClient;
    private final WeatherProperties props;

    public OpenMeteoProvider(RestClient externalRestClient, WeatherProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    public boolean isEnabled() {
        return props.enabled();
    }

    @Cacheable(cacheNames = CacheConfig.WEATHER,
            key = "T(com.resqai.backend.news.DisasterNewsCache).key(#query)")
    public WeatherSnapshot current(FeedQuery query) {
        String url = UriComponentsBuilder.fromHttpUrl(props.baseUrl())
                .queryParam("latitude", query.latitude())
                .queryParam("longitude", query.longitude())
                .queryParam("current", "temperature_2m,apparent_temperature,relative_humidity_2m,"
                        + "precipitation,weather_code,wind_speed_10m,wind_gusts_10m")
                .queryParam("hourly", "temperature_2m,precipitation_probability,weather_code")
                .queryParam("forecast_days", 1)
                .queryParam("timezone", "auto")
                .toUriString();

        JsonNode root = restClient.get().uri(url).retrieve().body(JsonNode.class);
        if (root == null) {
            throw new IllegalStateException("Open-Meteo returned no data");
        }
        return parse(root);
    }

    private WeatherSnapshot parse(JsonNode root) {
        JsonNode current = root.path("current");
        int code = current.path("weather_code").asInt();
        double precipitation = current.path("precipitation").asDouble(0);
        double windGust = current.path("wind_gusts_10m").asDouble(0);
        double temp = current.path("temperature_2m").asDouble();

        return new WeatherSnapshot(
                temp,
                current.path("apparent_temperature").asDouble(temp),
                current.path("relative_humidity_2m").asInt(0),
                precipitation,
                current.path("wind_speed_10m").asDouble(0),
                windGust,
                WeatherCondition.label(code),
                WeatherCondition.category(code),
                alertLevel(code, precipitation, windGust, temp),
                parseTime(current.path("time").asText(null)),
                nextHours(root.path("hourly"), current.path("time").asText(null)));
    }

    /** Coarse severe-weather heuristic — not an official warning, just a useful signal. */
    private String alertLevel(int code, double precipitationMmHr, double windGustKmh, double tempC) {
        boolean thunder = code == 95 || code == 96 || code == 99;
        if (precipitationMmHr >= 15 || windGustKmh >= 89 || (thunder && precipitationMmHr >= 4) || tempC >= 45) {
            return "SEVERE";
        }
        if (precipitationMmHr >= 7.6 || windGustKmh >= 62 || thunder || tempC >= 40) {
            return "WARNING";
        }
        if (precipitationMmHr >= 2.5 || windGustKmh >= 40) {
            return "WATCH";
        }
        return "NONE";
    }

    private List<WeatherSnapshot.HourlyOutlook> nextHours(JsonNode hourly, String currentTimeIso) {
        List<WeatherSnapshot.HourlyOutlook> result = new ArrayList<>();
        JsonNode times = hourly.path("time");
        JsonNode temps = hourly.path("temperature_2m");
        JsonNode pops = hourly.path("precipitation_probability");
        JsonNode codes = hourly.path("weather_code");
        if (!times.isArray()) {
            return result;
        }

        int startIndex = 0;
        for (int i = 0; i < times.size(); i++) {
            if (times.get(i).asText("").equals(currentTimeIso)) {
                startIndex = i;
                break;
            }
        }

        int end = Math.min(times.size(), startIndex + 6);
        for (int i = startIndex; i < end; i++) {
            result.add(new WeatherSnapshot.HourlyOutlook(
                    parseTime(times.get(i).asText(null)),
                    temps.isArray() && i < temps.size() ? temps.get(i).asDouble() : 0,
                    pops.isArray() && i < pops.size() ? pops.get(i).asInt() : 0,
                    codes.isArray() && i < codes.size() ? WeatherCondition.label(codes.get(i).asInt()) : "Unknown"));
        }
        return result;
    }

    private Instant parseTime(String iso) {
        if (iso == null) {
            return Instant.now();
        }
        try {
            return LocalDateTime.parse(iso).toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException ex) {
            return Instant.now();
        }
    }
}