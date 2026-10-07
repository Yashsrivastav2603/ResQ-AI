package com.resqai.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Everything the Disaster News module needs. All upstreams are individually
 * switchable so a missing API key never takes the feed down.
 */
@ConfigurationProperties(prefix = "resqai.news")
public record NewsProperties(
        int defaultRadiusKm,
        int maxRadiusKm,
        int defaultHistoryDays,
        int maxHistoryDays,
        int liveCacheMinutes,
        int historyCacheMinutes,
        int articlesCacheMinutes,
        int perProviderTimeoutMs,
        Usgs usgs,
        Gdacs gdacs,
        Eonet eonet,
        ReliefWeb reliefweb,
        GNews gnews) {

    public record Usgs(boolean enabled, String baseUrl, double minMagnitude) {
    }

    public record Gdacs(boolean enabled, String baseUrl, String eventTypes, String alertLevels) {
    }

    public record Eonet(boolean enabled, String baseUrl) {
    }

    public record ReliefWeb(boolean enabled, String baseUrl, String appname) {
    }

    public record GNews(boolean enabled, String baseUrl, String apiKey, String language, int maxArticles) {
        public boolean usable() {
            return enabled && apiKey != null && !apiKey.isBlank();
        }
    }
}
