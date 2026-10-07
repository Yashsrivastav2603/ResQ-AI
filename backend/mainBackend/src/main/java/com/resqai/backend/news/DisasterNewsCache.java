package com.resqai.backend.news;

import com.resqai.backend.common.GeoUtils;
import com.resqai.backend.config.CacheConfig;
import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.DisasterEvent;
import com.resqai.backend.news.model.NewsArticle;
import com.resqai.backend.news.provider.DisasterEventProvider;
import com.resqai.backend.news.provider.NewsArticleProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Caching seam between the service and the providers. It is a separate bean so
 * the Spring cache proxy actually applies (a self-invoked @Cacheable method is
 * not intercepted), and the key is a ~1 km coordinate grid so everyone in the
 * same neighbourhood shares a single upstream call.
 *
 * Live results expire in minutes, history and articles in tens of minutes; see
 * resqai.news.*CacheMinutes.
 */
@Component
public class DisasterNewsCache {

    private static final String KEY = "#provider.name() + '|' + "
            + "T(com.resqai.backend.news.DisasterNewsCache).key(#query)";

    @Cacheable(cacheNames = CacheConfig.LIVE_EVENTS, key = KEY)
    public List<DisasterEvent> liveEvents(DisasterEventProvider provider, FeedQuery query) {
        return provider.fetchLive(query);
    }

    @Cacheable(cacheNames = CacheConfig.HISTORY_EVENTS,
            key = KEY + " + '|' + #query.historyDays()")
    public List<DisasterEvent> historyEvents(DisasterEventProvider provider, FeedQuery query) {
        return provider.fetchHistory(query);
    }

    @Cacheable(cacheNames = CacheConfig.NEWS_ARTICLES, key = KEY)
    public List<NewsArticle> articles(NewsArticleProvider provider, FeedQuery query) {
        return provider.fetchArticles(query);
    }

    /** Coordinate-grid + radius cache key. Public because SpEL resolves it statically. */
    public static String key(FeedQuery query) {
        return GeoUtils.cacheGrid(query.latitude()) + ":"
                + GeoUtils.cacheGrid(query.longitude()) + ":"
                + query.radiusKm();
    }
}
