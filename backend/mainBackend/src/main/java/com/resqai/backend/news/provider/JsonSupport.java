package com.resqai.backend.news.provider;

import com.fasterxml.jackson.databind.JsonNode;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Defensive JSON helpers: upstream feeds change shape without notice. */
final class JsonSupport {

    private JsonSupport() {
    }

    static String text(JsonNode node, String field) {
        if (node == null) return null;
        JsonNode v = node.path(field);
        if (v.isMissingNode() || v.isNull()) return null;
        String s = v.asText(null);
        return s == null || s.isBlank() ? null : s;
    }

    static Double number(JsonNode node, String field) {
        if (node == null) return null;
        JsonNode v = node.path(field);
        if (v.isMissingNode() || v.isNull()) return null;
        if (v.isNumber()) return v.asDouble();
        try {
            return Double.parseDouble(v.asText().trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    static Instant epochMillis(JsonNode node, String field) {
        Double v = number(node, field);
        return v == null ? null : Instant.ofEpochMilli(v.longValue());
    }

    /** Parses the handful of shapes these feeds use for timestamps. */
    static Instant parseInstant(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String s = raw.trim();
        try {
            return Instant.parse(s);
        } catch (DateTimeParseException ignored) {
            // fall through
        }
        try {
            return java.time.OffsetDateTime.parse(s).toInstant();
        } catch (DateTimeParseException ignored) {
            // fall through
        }
        try {
            return LocalDateTime.parse(s).toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException ignored) {
            // fall through
        }
        try {
            return LocalDate.parse(s, DateTimeFormatter.ISO_LOCAL_DATE)
                    .atStartOfDay().toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    /** Strips tags and collapses whitespace from HTML-ish descriptions. */
    static String plainText(String html, int maxLength) {
        if (html == null) return null;
        String text = html.replaceAll("(?s)<[^>]*>", " ")
                .replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&quot;", "\"")
                .replaceAll("\\s+", " ")
                .trim();
        if (text.isEmpty()) return null;
        return text.length() <= maxLength ? text : text.substring(0, maxLength - 1) + "\u2026";
    }
}
