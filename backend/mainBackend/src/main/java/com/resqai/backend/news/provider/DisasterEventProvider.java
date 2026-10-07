package com.resqai.backend.news.provider;

import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.DisasterEvent;

import java.util.List;

/** An upstream that yields hazard events near a point. */
public interface DisasterEventProvider {

    String name();

    boolean isEnabled();

    /** Events currently open / reported inside the live window. */
    List<DisasterEvent> fetchLive(FeedQuery query);

    /** Events over the last {@code query.historyDays()} days. */
    List<DisasterEvent> fetchHistory(FeedQuery query);
}
