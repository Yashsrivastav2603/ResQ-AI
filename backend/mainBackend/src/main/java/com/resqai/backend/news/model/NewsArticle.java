package com.resqai.backend.news.model;

import java.time.Instant;

/** A human-readable report or article about a disaster near the user. */
public record NewsArticle(
        String id,
        String source,
        String publisher,
        String title,
        String summary,
        String url,
        String imageUrl,
        Instant publishedAt,
        String country) {
}
