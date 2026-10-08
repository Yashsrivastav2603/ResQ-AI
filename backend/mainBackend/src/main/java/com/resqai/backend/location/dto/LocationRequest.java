package com.resqai.backend.location.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * Location payload accepted at registration and on profile update.
 * Either supply coordinates (browser geolocation) or a free-text address /
 * city, which the backend forward-geocodes. At least one is required.
 */
public record LocationRequest(

        @DecimalMin(value = "-90.0", message = "latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "latitude must be between -90 and 90")
        Double latitude,

        @DecimalMin(value = "-180.0", message = "longitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "longitude must be between -180 and 180")
        Double longitude,

        String address,
        String city,
        String state,
        String country,
        String countryCode,
        String postalCode,

        @Min(value = 10, message = "radiusKm must be at least 10")
        @Max(value = 2000, message = "radiusKm must be at most 2000")
        Integer radiusKm) {

    public boolean hasCoordinates() {
        return latitude != null && longitude != null;
    }

    public boolean hasText() {
        return (address != null && !address.isBlank()) || (city != null && !city.isBlank());
    }

    public String freeText() {
        StringBuilder sb = new StringBuilder();
        if (address != null && !address.isBlank()) sb.append(address);
        if (city != null && !city.isBlank()) sb.append(sb.isEmpty() ? "" : ", ").append(city);
        if (state != null && !state.isBlank()) sb.append(sb.isEmpty() ? "" : ", ").append(state);
        if (country != null && !country.isBlank()) sb.append(sb.isEmpty() ? "" : ", ").append(country);
        return sb.toString();
    }
}
