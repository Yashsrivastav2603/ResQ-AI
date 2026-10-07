package com.resqai.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.resqai.backend.common.ErrorResponse;
import com.resqai.backend.config.RateLimitProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Fixed-window per-IP rate limiting for the two endpoints that get abused:
 * auth (credential stuffing) and disaster-news (upstream quota burn).
 *
 * The architecture puts this in Redis with a TTL counter; this is the same
 * algorithm in-process. Swap the Caffeine cache for a Redis INCR + EXPIRE when
 * you run more than one instance.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties props;
    private final ObjectMapper objectMapper;
    private final Cache<String, AtomicInteger> counters = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(1))
            .maximumSize(50_000)
            .build();

    public RateLimitFilter(RateLimitProperties props, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain) throws ServletException, IOException {

        if (!props.enabled()) {
            chain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        int limit;
        if (path.startsWith("/api/v1/auth/")) {
            limit = props.authRequestsPerMinute();
        } else if (path.startsWith("/api/v1/disaster-news")) {
            limit = props.newsRequestsPerMinute();
        } else {
            chain.doFilter(request, response);
            return;
        }

        String bucket = clientIp(request) + "|" + (path.startsWith("/api/v1/auth/") ? "auth" : "news");
        int hits = counters.get(bucket, k -> new AtomicInteger()).incrementAndGet();

        response.setHeader("X-RateLimit-Limit", String.valueOf(limit));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, limit - hits)));

        if (hits > limit) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", "60");
            objectMapper.writeValue(response.getOutputStream(), ErrorResponse.of(
                    "RATE_LIMITED", "Too many requests. Try again in a minute.", path));
            return;
        }
        chain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
