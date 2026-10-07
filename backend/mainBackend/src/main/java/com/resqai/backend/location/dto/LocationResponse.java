package com.resqai.backend.location.dto;

import com.resqai.backend.location.GeoLocation;

public record LocationResponse(
        Double latitude,
        Double longitude,
        String address,
        String city,
        String district,
        String state,
        String country,
        String countryCode,
        String postalCode,
        Integer radiusKm,
        String displayName) {

    public static LocationResponse from(GeoLocation l) {
        if (l == null) {
            return null;
        }
        return new LocationResponse(
                l.getLatitude(), l.getLongitude(), l.getAddress(), l.getCity(), l.getDistrict(),
                l.getState(), l.getCountry(), l.getCountryCode(), l.getPostalCode(),
                l.getRadiusKm(), l.displayName());
    }
}
