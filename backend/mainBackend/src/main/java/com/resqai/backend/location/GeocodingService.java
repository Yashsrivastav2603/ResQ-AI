package com.resqai.backend.location;

import com.fasterxml.jackson.databind.JsonNode;
import com.resqai.backend.common.GeoUtils;
import com.resqai.backend.common.exception.BadRequestException;
import com.resqai.backend.config.GeocodingProperties;
import com.resqai.backend.location.dto.LocationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Turns whatever the user gave us at registration into a complete
 * {@link GeoLocation}: coordinates plus a human-readable place.
 *
 *   coordinates supplied  -> reverse geocode to fill city/state/country
 *   address/city supplied -> forward geocode to fill latitude/longitude
 *
 * If the geocoder is unreachable, registration still succeeds with whatever the
 * client sent. Losing a city label must never block sign-up; missing
 * coordinates, however, is fatal because the whole Disaster News feed is
 * radius-based.
 */
@Service
public class GeocodingService {

    private static final Logger log = LoggerFactory.getLogger(GeocodingService.class);

    private final NominatimClient nominatim;
    private final GeocodingProperties props;

    public GeocodingService(NominatimClient nominatim, GeocodingProperties props) {
        this.nominatim = nominatim;
        this.props = props;
    }

    public GeoLocation resolve(LocationRequest request) {
        if (request == null || (!request.hasCoordinates() && !request.hasText())) {
            throw new BadRequestException(
                    "Location is required: send latitude+longitude, or an address/city we can geocode.");
        }

        GeoLocation location = new GeoLocation();
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());
        location.setAddress(blankToNull(request.address()));
        location.setCity(blankToNull(request.city()));
        location.setState(blankToNull(request.state()));
        location.setCountry(blankToNull(request.country()));
        location.setCountryCode(normalizeCountryCode(request.countryCode()));
        location.setPostalCode(blankToNull(request.postalCode()));
        location.setRadiusKm(request.radiusKm());

        if (props.enabled()) {
            try {
                if (request.hasCoordinates()) {
                    applyReverse(location, request.latitude(), request.longitude());
                } else {
                    applyForward(location, request.freeText());
                }
            } catch (Exception ex) {
                log.warn("Geocoding failed ({}); continuing with client-supplied location", ex.toString());
            }
        }

        if (!GeoUtils.isValidLatitude(location.getLatitude())
                || !GeoUtils.isValidLongitude(location.getLongitude())) {
            throw new BadRequestException(
                    "Could not determine coordinates for the given location. "
                            + "Allow browser location access or enter a more specific address.");
        }
        return location;
    }

    private void applyReverse(GeoLocation location, double lat, double lon) {
        JsonNode node = nominatim.reverse(GeoUtils.cacheGrid(lat), GeoUtils.cacheGrid(lon));
        if (node == null || node.isMissingNode() || node.has("error")) {
            return;
        }
        if (isBlank(location.getAddress())) {
            location.setAddress(text(node, "display_name"));
        }
        applyAddressDetails(location, node.path("address"));
    }

    private void applyForward(GeoLocation location, String query) {
        JsonNode node = nominatim.search(query);
        if (node == null || !node.isArray() || node.isEmpty()) {
            return;
        }
        JsonNode first = node.get(0);
        location.setLatitude(first.path("lat").asDouble());
        location.setLongitude(first.path("lon").asDouble());
        if (isBlank(location.getAddress())) {
            location.setAddress(text(first, "display_name"));
        }
        applyAddressDetails(location, first.path("address"));
    }

    private void applyAddressDetails(GeoLocation location, JsonNode address) {
        if (address == null || address.isMissingNode()) {
            return;
        }
        if (isBlank(location.getCity())) {
            location.setCity(firstNonBlank(
                    text(address, "city"), text(address, "town"), text(address, "village"),
                    text(address, "municipality"), text(address, "county")));
        }
        if (isBlank(location.getDistrict())) {
            location.setDistrict(firstNonBlank(
                    text(address, "state_district"), text(address, "county"), text(address, "suburb")));
        }
        if (isBlank(location.getState())) {
            location.setState(text(address, "state"));
        }
        if (isBlank(location.getCountry())) {
            location.setCountry(text(address, "country"));
        }
        if (isBlank(location.getCountryCode())) {
            location.setCountryCode(normalizeCountryCode(text(address, "country_code")));
        }
        if (isBlank(location.getPostalCode())) {
            location.setPostalCode(text(address, "postcode"));
        }
    }

    private static String normalizeCountryCode(String raw) {
        return isBlank(raw) ? null : raw.trim().toLowerCase();
    }

    private static String blankToNull(String s) {
        return isBlank(s) ? null : s.trim();
    }

    private static String text(JsonNode node, String field) {
        JsonNode v = node.path(field);
        return v.isMissingNode() || v.isNull() ? null : v.asText(null);
    }

    private static String firstNonBlank(String... values) {
        for (String v : values) {
            if (!isBlank(v)) {
                return v;
            }
        }
        return null;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
