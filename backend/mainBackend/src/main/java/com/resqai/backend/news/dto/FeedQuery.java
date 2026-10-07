package com.resqai.backend.news.dto;

/** Resolved, validated parameters for one Disaster News lookup. */
public record FeedQuery(
        double latitude,
        double longitude,
        int radiusKm,
        int historyDays,
        String city,
        String state,
        String country,
        String countryCode,
        String placeLabel) {

    /** Keyword string used against the news-article providers. */
    public String newsQuery() {
        StringBuilder place = new StringBuilder();
        if (city != null && !city.isBlank()) {
            place.append(city);
        } else if (state != null && !state.isBlank()) {
            place.append(state);
        } else if (country != null && !country.isBlank()) {
            place.append(country);
        }
        String hazards = "(disaster OR earthquake OR flood OR cyclone OR landslide OR wildfire"
                + " OR storm OR evacuation OR \"heavy rain\" OR rescue)";
        return place.isEmpty() ? hazards : "\"" + place + "\" AND " + hazards;
    }
}
