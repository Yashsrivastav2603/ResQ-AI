package com.resqai.backend.weather;

/**
 * Maps Open-Meteo's WMO weather codes onto a plain label and a broad category.
 */
final class WeatherCondition {

    private WeatherCondition() {
    }

    static String label(int code) {
        return switch (code) {
            case 0 -> "Clear sky";
            case 1, 2 -> "Partly cloudy";
            case 3 -> "Overcast";
            case 45, 48 -> "Fog";
            case 51, 53, 55 -> "Light drizzle";
            case 56, 57 -> "Freezing drizzle";
            case 61 -> "Light rain";
            case 63 -> "Moderate rain";
            case 65 -> "Heavy rain";
            case 66, 67 -> "Freezing rain";
            case 71, 73, 75, 77 -> "Snow";
            case 80 -> "Light showers";
            case 81 -> "Moderate showers";
            case 82 -> "Violent showers";
            case 85, 86 -> "Snow showers";
            case 95 -> "Thunderstorm";
            case 96, 99 -> "Thunderstorm with hail";
            default -> "Unknown";
        };
    }

    static String category(int code) {
        return switch (code) {
            case 0 -> "SUNNY";
            case 1, 2, 3 -> "CLOUDY";
            case 45, 48 -> "FOG";
            case 51, 53, 55, 56, 57, 61, 63, 80 -> "RAIN";
            case 65, 66, 67, 81, 82 -> "HEAVY_RAIN";
            case 71, 73, 75, 77, 85, 86 -> "SNOW";
            case 95, 96, 99 -> "STORM";
            default -> "UNKNOWN";
        };
    }
}