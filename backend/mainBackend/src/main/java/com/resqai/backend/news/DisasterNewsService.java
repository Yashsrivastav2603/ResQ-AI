package com.resqai.backend.news;
import com.resqai.backend.weather.OpenMeteoProvider;
import com.resqai.backend.weather.WeatherSnapshot;
import com.resqai.backend.common.GeoUtils;
import com.resqai.backend.common.exception.BadRequestException;
import com.resqai.backend.config.NewsProperties;
import com.resqai.backend.location.GeoLocation;
import com.resqai.backend.news.dto.DisasterFeedResponse;
import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.*;
import com.resqai.backend.news.provider.DisasterEventProvider;
import com.resqai.backend.news.provider.NewsArticleProvider;
import com.resqai.backend.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Fans out to every enabled provider in parallel, normalises, de-duplicates and
 * sorts the results, and scopes all of it to the user's registered location.
 *
 * Failure of any one upstream is never fatal: the feed returns what it has, and
 * the per-provider status list tells the UI what was missing and why.
 */
@Service
public class DisasterNewsService {

    private static final Logger log = LoggerFactory.getLogger(DisasterNewsService.class);

    private final List<DisasterEventProvider> eventProviders;
    private final OpenMeteoProvider weatherProvider;
    private final List<NewsArticleProvider> articleProviders;
    private final DisasterNewsCache cache;
    private final NewsProperties props;
    private final ExecutorService executor;

    public DisasterNewsService(List<DisasterEventProvider> eventProviders,
                               List<NewsArticleProvider> articleProviders,
                               OpenMeteoProvider weatherProvider,
                               DisasterNewsCache cache,
                               NewsProperties props,
                               ExecutorService providerExecutor) {
        this.eventProviders = eventProviders;
        this.articleProviders = articleProviders;
        this.weatherProvider = weatherProvider;
        this.cache = cache;
        this.props = props;
        this.executor = providerExecutor;
    }

    // ------------------------------------------------------------------ query

    /**
     * Builds the query from the user's registered location. Optional overrides
     * let the dashboard widen the radius or inspect another point without
     * touching the stored profile.
     */
    public FeedQuery buildQuery(User user, Double latOverride, Double lonOverride,
                                Integer radiusOverride, Integer daysOverride) {

        GeoLocation stored = user.getLocation();

        Double lat = latOverride != null ? latOverride : (stored == null ? null : stored.getLatitude());
        Double lon = lonOverride != null ? lonOverride : (stored == null ? null : stored.getLongitude());

        if (!GeoUtils.isValidLatitude(lat) || !GeoUtils.isValidLongitude(lon)) {
            throw new BadRequestException(
                    "No location on file for this account. Set your location "
                            + "(PUT /api/v1/users/me/location) before opening Disaster News.");
        }

        int radius = firstPositive(
                radiusOverride,
                stored == null ? null : stored.getRadiusKm(),
                props.defaultRadiusKm());
        radius = Math.min(radius, props.maxRadiusKm());

        int days = firstPositive(daysOverride, props.defaultHistoryDays());
        days = Math.min(days, props.maxHistoryDays());

        boolean pointOverridden = latOverride != null || lonOverride != null;
        return new FeedQuery(
                lat, lon, radius, days,
                pointOverridden ? null : safe(stored, GeoLocation::getCity),
                pointOverridden ? null : safe(stored, GeoLocation::getState),
                pointOverridden ? null : safe(stored, GeoLocation::getCountry),
                pointOverridden ? null : safe(stored, GeoLocation::getCountryCode),
                pointOverridden ? String.format("%.3f, %.3f", lat, lon)
                        : (stored == null ? "Unknown" : stored.displayName()));
    }

    // ------------------------------------------------------------------- feed

    /** The whole Disaster News screen in one response. */
    public DisasterFeedResponse feed(FeedQuery query) {
        List<ProviderStatus> statuses = Collections.synchronizedList(new ArrayList<>());

        CompletableFuture<List<DisasterEvent>> liveFuture =
                CompletableFuture.supplyAsync(() -> collectEvents(query, true, statuses), executor);
        CompletableFuture<List<DisasterEvent>> historyFuture =
                CompletableFuture.supplyAsync(() -> collectEvents(query, false, statuses), executor);
        CompletableFuture<List<NewsArticle>> articlesFuture =
                CompletableFuture.supplyAsync(() -> collectArticles(query, statuses), executor);
        CompletableFuture<WeatherSnapshot> weatherFuture =
                CompletableFuture.supplyAsync(() -> fetchWeather(query, statuses), executor);

        CompletableFuture.allOf(liveFuture, historyFuture, articlesFuture, weatherFuture).join();

        List<DisasterEvent> live = liveFuture.join();
        List<NewsArticle> articles = articlesFuture.join();

        // Anything already shown as live must not be repeated in the history list.
        Set<String> liveIds = live.stream().map(DisasterEvent::id).collect(Collectors.toSet());
        List<DisasterEvent> past = historyFuture.join().stream()
                .filter(e -> !liveIds.contains(e.id()))
                .toList();

        return new DisasterFeedResponse(
                new DisasterFeedResponse.FeedLocation(
                        query.latitude(), query.longitude(), query.city(), query.state(),
                        query.country(), query.countryCode(), query.placeLabel()),
                query.radiusKm(),
                query.historyDays(),
                weatherFuture.join(),
                summarise(live, past, articles),
                live,
                past,
                articles,
                dedupeStatuses(statuses),
                Instant.now());
    }

    public List<DisasterEvent> liveEvents(FeedQuery query) {
        return collectEvents(query, true, new ArrayList<>());
    }

    public List<DisasterEvent> pastEvents(FeedQuery query) {
        return collectEvents(query, false, new ArrayList<>());
    }

    public List<NewsArticle> articles(FeedQuery query) {
        return collectArticles(query, new ArrayList<>());
    }

    /** Provider health, for the commander/analyst dashboard. */
    /** Provider health, for the commander/analyst dashboard. */
    public List<ProviderStatus> providerHealth(FeedQuery query) {
        List<ProviderStatus> statuses = Collections.synchronizedList(new ArrayList<>());
        collectEvents(query, true, statuses);
        collectArticles(query, statuses);
        return dedupeStatuses(statuses);
    }

    /** Standalone weather lookup, used by the dedicated /weather endpoint. */
    public WeatherSnapshot weather(FeedQuery query) {
        return fetchWeather(query, new ArrayList<>());
    }

    private WeatherSnapshot fetchWeather(FeedQuery query, List<ProviderStatus> statuses) {
        if (!weatherProvider.isEnabled()) {
            statuses.add(ProviderStatus.disabled("Open-Meteo"));
            return null;
        }
        long start = System.currentTimeMillis();
        try {
            WeatherSnapshot snapshot = weatherProvider.current(query);
            statuses.add(ProviderStatus.ok("Open-Meteo", 1, System.currentTimeMillis() - start));
            return snapshot;
        } catch (Exception ex) {
            log.warn("Weather provider failed: {}", ex.toString());
            statuses.add(ProviderStatus.failed("Open-Meteo", System.currentTimeMillis() - start, describe(ex)));
            return null;
        }
    }

    // -------------------------------------------------------------- internals

    // -------------------------------------------------------------- internals

    private List<DisasterEvent> collectEvents(FeedQuery query, boolean live,
                                              List<ProviderStatus> statuses) {
        List<CompletableFuture<List<DisasterEvent>>> futures = eventProviders.stream()
                .map(provider -> CompletableFuture.supplyAsync(
                        () -> runEventProvider(provider, query, live, statuses), executor))
                .toList();

        List<DisasterEvent> all = new ArrayList<>();
        for (CompletableFuture<List<DisasterEvent>> future : futures) {
            all.addAll(joinQuietly(future));
        }

        return all.stream()
                .filter(e -> e.distanceKm() == null || e.distanceKm() <= query.radiusKm())
                .filter(e -> live == (e.status() == EventStatus.LIVE))
                .collect(Collectors.toMap(DisasterEvent::id, Function.identity(), (a, b) -> a,
                        LinkedHashMap::new))
                .values().stream()
                .sorted(eventOrder())
                .limit(live ? 50 : 100)
                .toList();
    }

    private List<DisasterEvent> runEventProvider(DisasterEventProvider provider, FeedQuery query,
                                                 boolean live, List<ProviderStatus> statuses) {
        if (!provider.isEnabled()) {
            statuses.add(ProviderStatus.disabled(provider.name()));
            return List.of();
        }
        long start = System.currentTimeMillis();
        try {
            List<DisasterEvent> result = live
                    ? cache.liveEvents(provider, query)
                    : cache.historyEvents(provider, query);
            statuses.add(ProviderStatus.ok(provider.name(), result.size(),
                    System.currentTimeMillis() - start));
            return result;
        } catch (Exception ex) {
            log.warn("Provider {} failed ({}): {}", provider.name(), live ? "live" : "history",
                    ex.toString());
            statuses.add(ProviderStatus.failed(provider.name(),
                    System.currentTimeMillis() - start, describe(ex)));
            return List.of();
        }
    }

    private List<NewsArticle> collectArticles(FeedQuery query, List<ProviderStatus> statuses) {
        List<CompletableFuture<List<NewsArticle>>> futures = articleProviders.stream()
                .map(provider -> CompletableFuture.supplyAsync(() -> {
                    if (!provider.isEnabled()) {
                        statuses.add(ProviderStatus.disabled(provider.name()));
                        return List.<NewsArticle>of();
                    }
                    long start = System.currentTimeMillis();
                    try {
                        List<NewsArticle> result = cache.articles(provider, query);
                        statuses.add(ProviderStatus.ok(provider.name(), result.size(),
                                System.currentTimeMillis() - start));
                        return result;
                    } catch (Exception ex) {
                        log.warn("News provider {} failed: {}", provider.name(), ex.toString());
                        statuses.add(ProviderStatus.failed(provider.name(),
                                System.currentTimeMillis() - start, describe(ex)));
                        return List.<NewsArticle>of();
                    }
                }, executor))
                .toList();

        List<NewsArticle> all = new ArrayList<>();
        for (CompletableFuture<List<NewsArticle>> future : futures) {
            all.addAll(joinQuietly(future));
        }

        return all.stream()
                .filter(a -> a.title() != null && a.url() != null)
                .collect(Collectors.toMap(NewsArticle::url, Function.identity(), (a, b) -> a,
                        LinkedHashMap::new))
                .values().stream()
                .sorted(Comparator.<NewsArticle, java.time.Instant>comparing(NewsArticle::publishedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(25)
                .toList();
    }

    /** Red first, then nearest, then most recent. */
    private Comparator<DisasterEvent> eventOrder() {
        return Comparator
                .comparingInt((DisasterEvent e) -> switch (e.severity()) {
                    case RED -> 0;
                    case ORANGE -> 1;
                    case GREEN -> 2;
                })
                .thenComparing(DisasterEvent::distanceKm,
                        Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(DisasterEvent::startedAt,
                        Comparator.nullsLast(Comparator.reverseOrder()));
    }

    private DisasterFeedResponse.Summary summarise(List<DisasterEvent> live,
                                                   List<DisasterEvent> past,
                                                   List<NewsArticle> articles) {
        int red = (int) live.stream().filter(e -> e.severity() == Severity.RED).count();
        int orange = (int) live.stream().filter(e -> e.severity() == Severity.ORANGE).count();
        String highest = red > 0 ? "RED" : orange > 0 ? "ORANGE" : live.isEmpty() ? "NONE" : "GREEN";
        Double nearest = live.stream()
                .map(DisasterEvent::distanceKm)
                .filter(Objects::nonNull)
                .min(Double::compareTo)
                .orElse(null);
        return new DisasterFeedResponse.Summary(
                live.size(), past.size(), articles.size(), red, orange, highest, nearest);
    }

    private List<ProviderStatus> dedupeStatuses(List<ProviderStatus> statuses) {
        Map<String, ProviderStatus> merged = new LinkedHashMap<>();
        synchronized (statuses) {
            for (ProviderStatus status : statuses) {
                merged.merge(status.provider(), status, (a, b) -> new ProviderStatus(
                        a.provider(),
                        a.enabled() || b.enabled(),
                        a.succeeded() || b.succeeded(),
                        a.itemCount() + b.itemCount(),
                        Math.max(a.durationMs(), b.durationMs()),
                        a.error() != null ? a.error() : b.error()));
            }
        }
        return List.copyOf(merged.values());
    }

    private <T> List<T> joinQuietly(CompletableFuture<List<T>> future) {
        try {
            return future.get(props.perProviderTimeoutMs() + 2000L, TimeUnit.MILLISECONDS);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            return List.of();
        } catch (ExecutionException | TimeoutException ex) {
            return List.of();
        }
    }

    private static String describe(Exception ex) {
        String message = ex.getMessage();
        return message == null || message.length() < 160
                ? ex.getClass().getSimpleName() + (message == null ? "" : ": " + message)
                : ex.getClass().getSimpleName();
    }

    private static int firstPositive(Integer... candidates) {
        for (Integer c : candidates) {
            if (c != null && c > 0) {
                return c;
            }
        }
        return 1;
    }

    private static String safe(GeoLocation location, Function<GeoLocation, String> getter) {
        return location == null ? null : getter.apply(location);
    }
}
