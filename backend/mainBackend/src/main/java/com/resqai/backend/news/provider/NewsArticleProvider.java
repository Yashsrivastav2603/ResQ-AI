package com.resqai.backend.news.provider;

import com.resqai.backend.news.dto.FeedQuery;
import com.resqai.backend.news.model.NewsArticle;

import java.util.List;

/** An upstream that yields written reports/articles near a point. */
public interface NewsArticleProvider {

    String name();

    boolean isEnabled();

    List<NewsArticle> fetchArticles(FeedQuery query);
}
