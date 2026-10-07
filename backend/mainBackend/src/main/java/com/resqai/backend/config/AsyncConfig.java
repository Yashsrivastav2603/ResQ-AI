package com.resqai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

/** Bounded pool used to fan out to the disaster-data providers in parallel. */
@Configuration
public class AsyncConfig {

    @Bean(name = "providerExecutor", destroyMethod = "shutdown")
    public ExecutorService providerExecutor() {
        AtomicInteger counter = new AtomicInteger();
        ThreadFactory factory = r -> {
            Thread t = new Thread(r, "provider-" + counter.incrementAndGet());
            t.setDaemon(true);
            return t;
        };
        return Executors.newFixedThreadPool(8, factory);
    }
}
