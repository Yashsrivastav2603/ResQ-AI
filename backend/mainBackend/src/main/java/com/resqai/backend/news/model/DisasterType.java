package com.resqai.backend.news.model;

/** Normalised hazard taxonomy across USGS / GDACS / EONET. */
public enum DisasterType {
    EARTHQUAKE,
    FLOOD,
    CYCLONE,
    WILDFIRE,
    VOLCANO,
    DROUGHT,
    LANDSLIDE,
    SEVERE_STORM,
    TSUNAMI,
    EXTREME_TEMPERATURE,
    OTHER;

    public static DisasterType fromGdacs(String code) {
        if (code == null) return OTHER;
        return switch (code.toUpperCase()) {
            case "EQ" -> EARTHQUAKE;
            case "TC" -> CYCLONE;
            case "FL" -> FLOOD;
            case "VO" -> VOLCANO;
            case "DR" -> DROUGHT;
            case "WF" -> WILDFIRE;
            case "TS" -> TSUNAMI;
            default -> OTHER;
        };
    }

    public static DisasterType fromEonetCategory(String categoryId) {
        if (categoryId == null) return OTHER;
        return switch (categoryId.toLowerCase()) {
            case "wildfires" -> WILDFIRE;
            case "severestorms" -> SEVERE_STORM;
            case "volcanoes" -> VOLCANO;
            case "floods" -> FLOOD;
            case "earthquakes" -> EARTHQUAKE;
            case "landslides" -> LANDSLIDE;
            case "drought" -> DROUGHT;
            case "temperatureextremes" -> EXTREME_TEMPERATURE;
            default -> OTHER;
        };
    }
}
