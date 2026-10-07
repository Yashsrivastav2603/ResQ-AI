package com.resqai.backend.weather;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Reads the "resqai.weather.*" section of application.yml.
 * Spring automatically fills in these fields at startup — you never call
 * "new WeatherProperties()" yourself.
 */
@ConfigurationProperties(prefix = "resqai.weather")
public record WeatherProperties(boolean enabled, String baseUrl, int cacheMinutes) {
}