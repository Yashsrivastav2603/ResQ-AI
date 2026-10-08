package com.resqai.backend.news.model;

/** Per-upstream health so the UI can show "GDACS unavailable" instead of an empty list. */
public record ProviderStatus(
        String provider,
        boolean enabled,
        boolean succeeded,
        int itemCount,
        long durationMs,
        String error) {

    public static ProviderStatus disabled(String provider) {
        return new ProviderStatus(provider, false, false, 0, 0, "disabled by configuration");
    }

    public static ProviderStatus ok(String provider, int count, long durationMs) {
        return new ProviderStatus(provider, true, true, count, durationMs, null);
    }

    public static ProviderStatus failed(String provider, long durationMs, String error) {
        return new ProviderStatus(provider, true, false, 0, durationMs, error);
    }
}
