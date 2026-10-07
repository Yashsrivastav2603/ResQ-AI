package com.resqai.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "resqai.rate-limit")
public record RateLimitProperties(
        boolean enabled,
        int authRequestsPerMinute,
        int newsRequestsPerMinute) {
}
