package com.resqai.backend.common;

/** Geodesic helpers used to scope every disaster feed to the user's location. */
public final class GeoUtils {

    public static final double EARTH_RADIUS_KM = 6371.0088;

    private GeoUtils() {
    }

    /** Great-circle distance in kilometres between two WGS84 points. */
    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1.0, Math.sqrt(a)));
    }

    /** Bounding box [minLat, minLon, maxLat, maxLon] around a point. */
    public static double[] boundingBox(double lat, double lon, double radiusKm) {
        double latDelta = Math.toDegrees(radiusKm / EARTH_RADIUS_KM);
        double cos = Math.cos(Math.toRadians(lat));
        double lonDelta = Math.abs(cos) < 1e-9
                ? 180.0
                : Math.toDegrees(radiusKm / (EARTH_RADIUS_KM * cos));
        return new double[]{
                clampLat(lat - latDelta),
                clampLon(lon - lonDelta),
                clampLat(lat + latDelta),
                clampLon(lon + lonDelta)
        };
    }

    public static boolean isValidLatitude(Double lat) {
        return lat != null && lat >= -90 && lat <= 90;
    }

    public static boolean isValidLongitude(Double lon) {
        return lon != null && lon >= -180 && lon <= 180;
    }

    /** Rounds coordinates so nearby users share a cache entry (~1.1 km grid). */
    public static double cacheGrid(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private static double clampLat(double v) {
        return Math.max(-90, Math.min(90, v));
    }

    private static double clampLon(double v) {
        return Math.max(-180, Math.min(180, v));
    }
}
