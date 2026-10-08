package com.resqai.backend.location;

import com.fasterxml.jackson.databind.JsonNode;
import com.resqai.backend.config.CacheConfig;
import com.resqai.backend.config.GeocodingProperties;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Thin cached wrapper over OpenStreetMap Nominatim. Kept as its own bean so the
 * {@code @Cacheable} proxy actually applies (self-invocation would bypass it).
 * Nominatim's usage policy requires an identifying User-Agent and roughly one
 * request per second, which the 24h cache keeps us well inside.
 */
@Component
public class NominatimClient {

    private final RestClient restClient;
    private final GeocodingProperties props;

    public NominatimClient(RestClient externalRestClient, GeocodingProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    @Cacheable(cacheNames = CacheConfig.GEOCODE, key = "'rev:' + #lat + ':' + #lon", unless = "#result == null")
    public JsonNode reverse(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl(props.baseUrl() + "/reverse")
                .queryParam("format", "jsonv2")
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("zoom", 12)
                .queryParam("addressdetails", 1)
                .toUriString();
        return get(url);
    }

    @Cacheable(cacheNames = CacheConfig.GEOCODE, key = "'fwd:' + #query", unless = "#result == null")
    public JsonNode search(String query) {
        String url = UriComponentsBuilder.fromHttpUrl(props.baseUrl() + "/search")
                .queryParam("format", "jsonv2")
                .queryParam("q", query)
                .queryParam("limit", 1)
                .queryParam("addressdetails", 1)
                .toUriString();
        return get(url);
    }

    private JsonNode get(String url) {
        return restClient.get()
                .uri(url)
                .header("User-Agent", props.userAgent())
                .header("Accept-Language", "en")
                .retrieve()
                .body(JsonNode.class);
    }
}
