package com.resqai.backend.config;
import com.resqai.backend.weather.WeatherProperties;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.concurrent.TimeUnit;

/**
 * In-process caching so repeated Disaster News polls do not hammer USGS/GDACS.
 * The architecture calls for Redis here in production; swap the CacheManager
 * for RedisCacheManager and nothing else in the news module changes.
 */
@Configuration
public class CacheConfig {

    public static final String LIVE_EVENTS = "liveEvents";
    public static final String HISTORY_EVENTS = "historyEvents";
    public static final String NEWS_ARTICLES = "newsArticles";
    public static final String GEOCODE = "geocode";
    public static final String WEATHER = "weather";

    @Bean
    @Primary
    public CacheManager cacheManager(NewsProperties props, WeatherProperties weatherProps) {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCacheNames(java.util.List.of(LIVE_EVENTS, HISTORY_EVENTS, NEWS_ARTICLES, GEOCODE, WEATHER));
        manager.setCaffeine(Caffeine.newBuilder().maximumSize(2000)
                .expireAfterWrite(props.liveCacheMinutes(), TimeUnit.MINUTES));

        manager.registerCustomCache(HISTORY_EVENTS, Caffeine.newBuilder().maximumSize(2000)
                .expireAfterWrite(props.historyCacheMinutes(), TimeUnit.MINUTES).build());
        manager.registerCustomCache(NEWS_ARTICLES, Caffeine.newBuilder().maximumSize(2000)
                .expireAfterWrite(props.articlesCacheMinutes(), TimeUnit.MINUTES).build());
        manager.registerCustomCache(GEOCODE, Caffeine.newBuilder().maximumSize(5000)
                .expireAfterWrite(24, TimeUnit.HOURS).build());
        manager.registerCustomCache(WEATHER, Caffeine.newBuilder().maximumSize(2000)
                .expireAfterWrite(weatherProps.cacheMinutes(), TimeUnit.MINUTES).build());
        return manager;
    }
}
