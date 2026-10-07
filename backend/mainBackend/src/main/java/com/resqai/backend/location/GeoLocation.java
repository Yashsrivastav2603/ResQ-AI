package com.resqai.backend.location;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The location captured at registration. Everything in the Disaster News
 * module is scoped by this: latitude/longitude drive radius searches,
 * city/countryCode drive the news-article queries.
 */
@Embeddable
public class GeoLocation {

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "address", length = 512)
    private String address;

    @Column(name = "city", length = 128)
    private String city;

    @Column(name = "district", length = 128)
    private String district;

    @Column(name = "state", length = 128)
    private String state;

    @Column(name = "country", length = 128)
    private String country;

    /** ISO 3166-1 alpha-2, lowercase (GNews expects e.g. "in"). */
    @Column(name = "country_code", length = 8)
    private String countryCode;

    @Column(name = "postal_code", length = 32)
    private String postalCode;

    /** Preferred search radius for this user's Disaster News feed. */
    @Column(name = "radius_km")
    private Integer radiusKm;

    public GeoLocation() {
    }

    public boolean hasCoordinates() {
        return latitude != null && longitude != null;
    }

    public String displayName() {
        if (city != null && !city.isBlank()) {
            return state != null && !state.isBlank() ? city + ", " + state : city;
        }
        if (address != null && !address.isBlank()) {
            return address;
        }
        return country != null ? country : "Unknown location";
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Integer getRadiusKm() { return radiusKm; }
    public void setRadiusKm(Integer radiusKm) { this.radiusKm = radiusKm; }
}
