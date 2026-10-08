package com.resqai.backend.news.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.resqai.backend.config.NewsProperties;
import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.NewsArticle;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * GNews search: mainstream headlines about the user's city/region, restricted to
 * their country of registration. Needs a free API key (GNEWS_API_KEY); with no
 * key set the provider reports itself disabled and the feed simply runs on
 * ReliefWeb plus the hazard providers.
 */
@Component
public class GNewsProvider implements NewsArticleProvider {

    private final RestClient restClient;
    private final NewsProperties props;

    public GNewsProvider(RestClient externalRestClient, NewsProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    @Override
    public String name() {
        return "GNews";
    }

    @Override
    public boolean isEnabled() {
        return props.gnews().usable();
    }

    @Override
    public List<NewsArticle> fetchArticles(FeedQuery query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(props.gnews().baseUrl())
                .queryParam("q", query.newsQuery())
                .queryParam("lang", props.gnews().language())
                .queryParam("max", props.gnews().maxArticles())
                .queryParam("sortby", "publishedAt")
                .queryParam("apikey", props.gnews().apiKey());

        if (query.countryCode() != null && query.countryCode().length() == 2) {
            builder.queryParam("country", query.countryCode());
        }

        JsonNode root = restClient.get()
                .uri(builder.encode().toUriString())
                .retrieve()
                .body(JsonNode.class);

        List<NewsArticle> articles = new ArrayList<>();
        if (root == null) {
            return articles;
        }

        for (JsonNode a : root.path("articles")) {
            String url = JsonSupport.text(a, "url");
            Instant published = JsonSupport.parseInstant(JsonSupport.text(a, "publishedAt"));
            articles.add(new NewsArticle(
                    "gnews:" + Integer.toHexString(url == null ? a.hashCode() : url.hashCode()),
                    name(),
                    JsonSupport.text(a.path("source"), "name"),
                    JsonSupport.text(a, "title"),
                    JsonSupport.plainText(JsonSupport.text(a, "description"), 320),
                    url,
                    JsonSupport.text(a, "image"),
                    published,
                    query.country()));
        }
        return articles;
    }
}
