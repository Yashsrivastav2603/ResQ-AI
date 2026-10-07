package com.resqai.backend.news;
import com.resqai.backend.weather.WeatherSnapshot;
import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.news.dto.DisasterFeedResponse;
import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.DisasterEvent;
import com.resqai.backend.news.model.NewsArticle;
import com.resqai.backend.news.model.ProviderStatus;
import com.resqai.backend.security.AuthenticatedUser;
import com.resqai.backend.security.CurrentUser;
import com.resqai.backend.user.User;
import com.resqai.backend.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

/**
 * The Disaster News section.
 *
 * Every endpoint is authenticated and is scoped, by default, to the location
 * the user gave at registration. lat/lon/radiusKm/days are optional overrides
 * for the "change area" control on the dashboard.
 */
@RestController
@RequestMapping("/api/v1/disaster-news")
@Tag(name = "Disaster News")
public class DisasterNewsController {

    private final DisasterNewsService newsService;
    private final UserService userService;

    public DisasterNewsController(DisasterNewsService newsService, UserService userService) {
        this.newsService = newsService;
        this.userService = userService;
    }

    @GetMapping("/feed")
    @Operation(summary = "Everything the Disaster News screen needs: live events, past events and reports")
    public ResponseEntity<ApiResponse<DisasterFeedResponse>> feed(
            @CurrentUser AuthenticatedUser principal,
            @Parameter(description = "Override latitude") @RequestParam(required = false) Double lat,
            @Parameter(description = "Override longitude") @RequestParam(required = false) Double lon,
            @Parameter(description = "Search radius in km") @RequestParam(required = false) Integer radiusKm,
            @Parameter(description = "How far back to look") @RequestParam(required = false) Integer days) {

        FeedQuery query = query(principal, lat, lon, radiusKm, days);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(2)).cachePrivate())
                .body(ApiResponse.ok(newsService.feed(query)));
    }

    @GetMapping("/weather")
    @Operation(summary = "Current weather and short outlook for the user's location")
    public ResponseEntity<ApiResponse<WeatherSnapshot>> weather(
            @CurrentUser AuthenticatedUser principal,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        return ResponseEntity.ok(ApiResponse.ok(
                newsService.weather(query(principal, lat, lon, null, null))));
    }

    @GetMapping("/live")
    @Operation(summary = "Currently active / ongoing events near the user")
    public ResponseEntity<ApiResponse<List<DisasterEvent>>> live(
            @CurrentUser AuthenticatedUser principal,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Integer radiusKm) {
        return ResponseEntity.ok(ApiResponse.ok(
                newsService.liveEvents(query(principal, lat, lon, radiusKm, null))));
    }

    @GetMapping("/history")
    @Operation(summary = "Previous events near the user over the last N days")
    public ResponseEntity<ApiResponse<List<DisasterEvent>>> history(
            @CurrentUser AuthenticatedUser principal,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Integer radiusKm,
            @RequestParam(required = false) Integer days) {
        return ResponseEntity.ok(ApiResponse.ok(
                newsService.pastEvents(query(principal, lat, lon, radiusKm, days))));
    }

    @GetMapping("/articles")
    @Operation(summary = "Disaster news reports and headlines for the user's area")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> articles(
            @CurrentUser AuthenticatedUser principal,
            @RequestParam(required = false) Integer radiusKm) {
        return ResponseEntity.ok(ApiResponse.ok(
                newsService.articles(query(principal, null, null, radiusKm, null))));
    }

    @GetMapping("/sources")
    @Operation(summary = "Upstream provider health (ADMIN / COMMANDER / ANALYST)")
    public ResponseEntity<ApiResponse<List<ProviderStatus>>> sources(
            @CurrentUser AuthenticatedUser principal) {
        return ResponseEntity.ok(ApiResponse.ok(
                newsService.providerHealth(query(principal, null, null, null, null))));
    }

    private FeedQuery query(AuthenticatedUser principal, Double lat, Double lon,
                            Integer radiusKm, Integer days) {
        User user = userService.require(principal.getId());
        return newsService.buildQuery(user, lat, lon, radiusKm, days);
    }
}
