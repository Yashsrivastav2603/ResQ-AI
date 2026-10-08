package com.resqai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * One shared RestClient for every outbound call, with hard connect/read
 * timeouts so a slow upstream can never pin a request thread (see the
 * "AI Service Failure -> Timeout, Retry, Fallback" row of the architecture).
 */
@Configuration
public class RestClientConfig {

    @Bean
    public RestClient externalRestClient(NewsProperties newsProperties) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(3000));
        factory.setReadTimeout(Duration.ofMillis(newsProperties.perProviderTimeoutMs()));
        return RestClient.builder()
                .requestFactory(factory)
                .defaultHeader("Accept", "application/json")
                .defaultHeader("User-Agent", "ResQ-AI-Backend/0.1")
                .build();
    }
}
