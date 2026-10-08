package com.resqai.backend.user.dto;

import com.resqai.backend.location.dto.LocationResponse;
import com.resqai.backend.user.User;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String role,
        boolean enabled,
        LocationResponse location,
        Instant createdAt,
        Instant lastLoginAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.isEnabled(),
                LocationResponse.from(user.getLocation()),
                user.getCreatedAt(),
                user.getLastLoginAt());
    }
}
