package com.resqai.backend.weather;

import java.time.Instant;
import java.util.List;

/**
 * Current conditions plus a short outlook, for the location a request is scoped to.
 */
public record WeatherSnapshot(
        double temperatureC,
        double feelsLikeC,
        int humidityPercent,
        double precipitationMm,
        double windSpeedKmh,
        double windGustKmh,
        String condition,
        String category,
        /** NONE, WATCH, WARNING, SEVERE — a heuristic, not an official IMD warning. */
        String alertLevel,
        Instant observedAt,
        List<HourlyOutlook> nextHours) {

    public record HourlyOutlook(
            Instant time,
            double temperatureC,
            int precipitationProbability,
            String condition) {
    }
}