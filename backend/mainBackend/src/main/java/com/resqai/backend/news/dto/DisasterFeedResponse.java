package com.resqai.backend.news.dto;
import com.resqai.backend.weather.WeatherSnapshot;
import com.resqai.backend.news.model.DisasterEvent;
import com.resqai.backend.news.model.NewsArticle;
import com.resqai.backend.news.model.ProviderStatus;

import java.time.Instant;
import java.util.List;

/**
 * Exactly what the "Disaster News" screen needs in one call:
 * where we searched, what is happening now, what happened before, and the
 * reporting around it.
 */
public record DisasterFeedResponse(
        FeedLocation location,
        int radiusKm,
        int historyDays,
        WeatherSnapshot weather,
        Summary summary,
        List<DisasterEvent> liveEvents,
        List<DisasterEvent> pastEvents,
        List<NewsArticle> newsReports,
        List<ProviderStatus> providers,
        Instant generatedAt) {

    public record FeedLocation(
            double latitude,
            double longitude,
            String city,
            String state,
            String country,
            String countryCode,
            String label) {
    }

    public record Summary(
            int liveCount,
            int pastCount,
            int articleCount,
            int redAlerts,
            int orangeAlerts,
            String highestSeverity,
            Double nearestEventKm) {
    }
}
