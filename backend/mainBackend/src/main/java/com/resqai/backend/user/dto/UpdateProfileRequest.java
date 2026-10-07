package com.resqai.backend.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 2, max = 150) String name,
        @Pattern(regexp = "^$|^[+0-9][0-9 \\-]{6,19}$", message = "phone must be a valid phone number")
        String phone) {
}
