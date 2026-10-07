package com.resqai.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "resqai.geocoding")
public record GeocodingProperties(boolean enabled, String baseUrl, String userAgent) {
}
