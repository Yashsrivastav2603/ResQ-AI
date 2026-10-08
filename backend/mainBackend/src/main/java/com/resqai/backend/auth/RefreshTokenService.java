package com.resqai.backend.auth;

import com.resqai.backend.common.exception.UnauthorizedException;
import com.resqai.backend.config.JwtProperties;
import com.resqai.backend.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository repository;
    private final JwtProperties jwtProperties;
    private final SecureRandom random = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository repository, JwtProperties jwtProperties) {
        this.repository = repository;
        this.jwtProperties = jwtProperties;
    }

    /** Issues an opaque refresh token; only its digest is persisted. */
    @Transactional
    public String issue(User user) {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hash(raw));
        token.setExpiresAt(Instant.now().plus(jwtProperties.refreshTokenTtl()));
        repository.save(token);
        return raw;
    }

    /** Validates and rotates: the presented token is revoked and a new one returned. */
    @Transactional
    public RotationResult rotate(String rawToken) {
        RefreshToken stored = repository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new UnauthorizedException("Refresh token is invalid or has been used."));

        if (!stored.isActive()) {
            // A revoked token being presented again suggests theft: kill the whole family.
            repository.revokeAllForUser(stored.getUser());
            throw new UnauthorizedException("Refresh token expired or revoked. Please sign in again.");
        }

        stored.setRevoked(true);
        repository.save(stored);

        User user = stored.getUser();
        return new RotationResult(user, issue(user));
    }

    @Transactional
    public void revoke(String rawToken) {
        repository.findByTokenHash(hash(rawToken)).ifPresent(t -> {
            t.setRevoked(true);
            repository.save(t);
        });
    }

    @Transactional
    public void revokeAll(User user) {
        repository.revokeAllForUser(user);
    }

    /** Hourly sweep of revoked/expired rows. */
    @Scheduled(fixedDelay = 3_600_000L, initialDelay = 600_000L)
    @Transactional
    public void purge() {
        int removed = repository.deleteExpired(Instant.now());
        if (removed > 0) {
            log.info("Purged {} stale refresh tokens", removed);
        }
    }

    private String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getEncoder()
                    .encodeToString(digest.digest(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    public record RotationResult(User user, String refreshToken) {
    }
}
