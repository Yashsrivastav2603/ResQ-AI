package com.resqai.backend.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateRoleRequest(
        @NotBlank(message = "role is required") String role,
        Boolean enabled) {
}
