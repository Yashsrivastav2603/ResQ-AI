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
 * ReliefWeb (UN OCHA) situation reports and disaster bulletins, filtered to the
 * user's country and searched on their city/state. This is the "disaster news
 * reports" half of the feed: official reporting rather than headlines.
 *
 * Since Nov 2025 the v2 API requires a pre-approved appname. Request one at
 * https://apidoc.reliefweb.int/ and set RELIEFWEB_APPNAME, or set
 * RELIEFWEB_ENABLED=false to run on GNews alone.
 */
@Component
public class ReliefWebProvider implements NewsArticleProvider {

    private final RestClient restClient;
    private final NewsProperties props;

    public ReliefWebProvider(RestClient externalRestClient, NewsProperties props) {
        this.restClient = externalRestClient;
        this.props = props;
    }

    @Override
    public String name() {
        return "ReliefWeb";
    }

    @Override
    public boolean isEnabled() {
        return props.reliefweb().enabled();
    }

    @Override
    public List<NewsArticle> fetchArticles(FeedQuery query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(props.reliefweb().baseUrl())
                .queryParam("appname", props.reliefweb().appname())
                .queryParam("limit", 10)
                .queryParam("sort[]", "date.created:desc")
                .queryParam("fields[include][]", "title")
                .queryParam("fields[include][]", "body")
                .queryParam("fields[include][]", "url")
                .queryParam("fields[include][]", "date.created")
                .queryParam("fields[include][]", "source.name")
                .queryParam("fields[include][]", "primary_country.name")
                .queryParam("fields[include][]", "primary_country.iso3");

        if (query.country() != null && !query.country().isBlank()) {
            builder.queryParam("filter[field]", "country")
                    .queryParam("filter[value]", query.country());
        }

        String locality = query.city() != null && !query.city().isBlank() ? query.city() : query.state();
        if (locality != null && !locality.isBlank()) {
            builder.queryParam("query[value]", locality)
                    .queryParam("query[fields][]", "title")
                    .queryParam("query[fields][]", "body");
        }

        JsonNode root = restClient.get()
                .uri(builder.encode().toUriString())
                .retrieve()
                .body(JsonNode.class);

        List<NewsArticle> articles = new ArrayList<>();
        if (root == null) {
            return articles;
        }

        for (JsonNode item : root.path("data")) {
            JsonNode f = item.path("fields");
            Instant published = JsonSupport.parseInstant(JsonSupport.text(f.path("date"), "created"));
            String publisher = f.path("source").isArray() && !f.path("source").isEmpty()
                    ? JsonSupport.text(f.path("source").get(0), "name")
                    : "ReliefWeb";

            articles.add(new NewsArticle(
                    "reliefweb:" + JsonSupport.text(item, "id"),
                    name(),
                    publisher,
                    JsonSupport.text(f, "title"),
                    JsonSupport.plainText(JsonSupport.text(f, "body"), 320),
                    JsonSupport.text(f, "url"),
                    null,
                    published,
                    JsonSupport.text(f.path("primary_country"), "name")));
        }
        return articles;
    }
}
