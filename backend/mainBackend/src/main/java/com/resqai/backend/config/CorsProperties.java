package com.resqai.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "resqai.cors")
public record CorsProperties(List<String> allowedOrigins) {
}
