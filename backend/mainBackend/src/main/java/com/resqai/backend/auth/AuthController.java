package com.resqai.backend.auth;

import com.resqai.backend.auth.dto.*;
import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.common.exception.UnauthorizedException;
import com.resqai.backend.security.AuthenticatedUser;
import com.resqai.backend.security.CurrentUser;
import com.resqai.backend.user.UserRepository;
import com.resqai.backend.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    @Operation(summary = "Create an account (location is captured here and drives Disaster News)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Account created", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Exchange email + password for an access and refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Signed in", authService.login(request)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate a refresh token for a fresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed", authService.refresh(request)));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke the supplied refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshRequest request) {
        authService.logout(request == null ? null : request.refreshToken());
        return ResponseEntity.ok(ApiResponse.ok("Signed out", null));
    }

    @GetMapping("/me")
    @Operation(summary = "The currently authenticated user")
    public ResponseEntity<ApiResponse<UserResponse>> me(@CurrentUser AuthenticatedUser principal) {
        UserResponse user = userRepository.findById(principal.getId())
                .map(UserResponse::from)
                .orElseThrow(() -> new UnauthorizedException("Your account no longer exists."));
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
