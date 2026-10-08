package com.resqai.backend.auth;

import com.resqai.backend.auth.dto.*;
import com.resqai.backend.common.exception.DuplicateResourceException;
import com.resqai.backend.common.exception.UnauthorizedException;
import com.resqai.backend.location.GeoLocation;
import com.resqai.backend.location.GeocodingService;
import com.resqai.backend.security.JwtService;
import com.resqai.backend.user.Role;
import com.resqai.backend.user.User;
import com.resqai.backend.user.UserRepository;
import com.resqai.backend.user.dto.UserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Set;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    /** Roles a user may pick for themselves at sign-up. */
    private static final Set<Role> SELF_ASSIGNABLE = EnumSet.of(Role.CITIZEN, Role.RESPONDER, Role.ANALYST);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final GeocodingService geocodingService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService,
                       GeocodingService geocodingService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.geocodingService = geocodingService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("An account with that email already exists.");
        }

        // Resolve the location first: if we cannot place the user on the map,
        // the Disaster News feed would be useless, so we fail fast.
        GeoLocation location = geocodingService.resolve(request.location());

        Role requested = Role.fromNullable(request.role(), Role.CITIZEN);
        Role role = SELF_ASSIGNABLE.contains(requested) ? requested : Role.CITIZEN;

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPhone(emptyToNull(request.phone()));
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setLocation(location);
        user.setEnabled(true);
        userRepository.save(user);

        log.info("Registered user {} with role {} at {}", user.getId(), role, location.displayName());
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        if (!user.isEnabled()) {
            throw new UnauthorizedException("This account has been disabled. Contact an administrator.");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshTokenService.RotationResult result = refreshTokenService.rotate(request.refreshToken());
        User user = result.user();
        if (!user.isEnabled()) {
            throw new UnauthorizedException("This account has been disabled.");
        }
        return AuthResponse.of(
                jwtService.generateAccessToken(user),
                result.refreshToken(),
                jwtService.accessTokenTtlSeconds(),
                UserResponse.from(user));
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revoke(refreshToken);
        }
    }

    private AuthResponse issueTokens(User user) {
        return AuthResponse.of(
                jwtService.generateAccessToken(user),
                refreshTokenService.issue(user),
                jwtService.accessTokenTtlSeconds(),
                UserResponse.from(user));
    }

    private static String emptyToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
