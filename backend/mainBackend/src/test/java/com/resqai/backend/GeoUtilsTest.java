package com.resqai.backend;

import com.resqai.backend.common.GeoUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GeoUtilsTest {

    @Test
    void haversineMatchesKnownDistance() {
        // Lucknow -> New Delhi is roughly 420 km great-circle.
        double km = GeoUtils.haversineKm(26.8467, 80.9462, 28.6139, 77.2090);
        assertTrue(km > 400 && km < 440, "expected ~420km but was " + km);
    }

    @Test
    void boundingBoxContainsThePoint() {
        double[] box = GeoUtils.boundingBox(26.8467, 80.9462, 300);
        assertTrue(box[0] < 26.8467 && box[2] > 26.8467);
        assertTrue(box[1] < 80.9462 && box[3] > 80.9462);
    }

    @Test
    void cacheGridCollapsesNearbyPoints() {
        assertEquals(GeoUtils.cacheGrid(26.8467), GeoUtils.cacheGrid(26.8471));
    }
}
