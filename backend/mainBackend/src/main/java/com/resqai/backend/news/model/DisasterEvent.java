package com.resqai.backend.news.model;

import java.time.Instant;

/**
 * One normalised hazard event, whatever upstream it came from.
 * distanceKm is always measured from the requesting user's registered location.
 */
public record DisasterEvent(
        String id,
        String source,
        DisasterType type,
        String title,
        String description,
        Severity severity,
        EventStatus status,
        Double latitude,
        Double longitude,
        Double distanceKm,
        String place,
        String country,
        Double magnitude,
        String magnitudeUnit,
        Instant startedAt,
        Instant endedAt,
        Instant updatedAt,
        String url,
        String iconUrl) {

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String id;
        private String source;
        private DisasterType type = DisasterType.OTHER;
        private String title;
        private String description;
        private Severity severity = Severity.GREEN;
        private EventStatus status = EventStatus.PAST;
        private Double latitude;
        private Double longitude;
        private Double distanceKm;
        private String place;
        private String country;
        private Double magnitude;
        private String magnitudeUnit;
        private Instant startedAt;
        private Instant endedAt;
        private Instant updatedAt;
        private String url;
        private String iconUrl;

        public Builder id(String v) { this.id = v; return this; }
        public Builder source(String v) { this.source = v; return this; }
        public Builder type(DisasterType v) { this.type = v; return this; }
        public Builder title(String v) { this.title = v; return this; }
        public Builder description(String v) { this.description = v; return this; }
        public Builder severity(Severity v) { this.severity = v; return this; }
        public Builder status(EventStatus v) { this.status = v; return this; }
        public Builder latitude(Double v) { this.latitude = v; return this; }
        public Builder longitude(Double v) { this.longitude = v; return this; }
        public Builder distanceKm(Double v) { this.distanceKm = v; return this; }
        public Builder place(String v) { this.place = v; return this; }
        public Builder country(String v) { this.country = v; return this; }
        public Builder magnitude(Double v) { this.magnitude = v; return this; }
        public Builder magnitudeUnit(String v) { this.magnitudeUnit = v; return this; }
        public Builder startedAt(Instant v) { this.startedAt = v; return this; }
        public Builder endedAt(Instant v) { this.endedAt = v; return this; }
        public Builder updatedAt(Instant v) { this.updatedAt = v; return this; }
        public Builder url(String v) { this.url = v; return this; }
        public Builder iconUrl(String v) { this.iconUrl = v; return this; }

        public DisasterEvent build() {
            return new DisasterEvent(id, source, type, title, description, severity, status,
                    latitude, longitude, distanceKm, place, country, magnitude, magnitudeUnit,
                    startedAt, endedAt, updatedAt, url, iconUrl);
        }
    }

    public DisasterEvent withDistance(double km) {
        return new DisasterEvent(id, source, type, title, description, severity, status,
                latitude, longitude, km, place, country, magnitude, magnitudeUnit,
                startedAt, endedAt, updatedAt, url, iconUrl);
    }
}
