package com.resqai.backend.security;

import com.resqai.backend.config.JwtProperties;
import com.resqai.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/** Issues and verifies HS256 access tokens. */
@Service
public class JwtService {

    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_NAME = "name";
    private static final String CLAIM_TYPE = "typ";
    private static final String TYPE_ACCESS = "access";

    private final SecretKey key;
    private final JwtProperties props;

    public JwtService(JwtProperties props) {
        this.props = props;
        byte[] secret = props.secret().getBytes(StandardCharsets.UTF_8);
        if (secret.length < 32) {
            throw new IllegalStateException(
                    "resqai.jwt.secret must be at least 32 bytes. Set the JWT_SECRET environment variable.");
        }
        this.key = Keys.hmacShaKeyFor(secret);
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(props.accessTokenTtl());
        return Jwts.builder()
                .claims(Map.of(
                        CLAIM_EMAIL, user.getEmail(),
                        CLAIM_NAME, user.getName(),
                        CLAIM_ROLE, user.getRole().name(),
                        CLAIM_TYPE, TYPE_ACCESS))
                .issuer(props.issuer())
                .subject(user.getId().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .id(UUID.randomUUID().toString())
                .signWith(key)
                .compact();
    }

    public long accessTokenTtlSeconds() {
        return props.accessTokenTtl().toSeconds();
    }

    /** @return parsed claims, or null when the token is absent, expired or forged. */
    public Claims parse(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(props.issuer())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return TYPE_ACCESS.equals(claims.get(CLAIM_TYPE, String.class)) ? claims : null;
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    public UUID userId(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    public String role(Claims claims) {
        return claims.get(CLAIM_ROLE, String.class);
    }
}
