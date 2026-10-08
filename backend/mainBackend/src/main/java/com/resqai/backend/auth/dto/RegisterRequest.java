package com.resqai.backend.auth.dto;

import com.resqai.backend.location.dto.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

/**
 * Sign-up payload. The location block is mandatory: it is what every
 * Disaster News query is later scoped to.
 */
public record RegisterRequest(

        @NotBlank(message = "name is required")
        @Size(min = 2, max = 150)
        String name,

        @NotBlank(message = "email is required")
        @Email(message = "email must be a valid address")
        @Size(max = 255)
        String email,

        @Pattern(regexp = "^$|^[+0-9][0-9 \\-]{6,19}$", message = "phone must be a valid phone number")
        String phone,

        @NotBlank(message = "password is required")
        @Size(min = 8, max = 72, message = "password must be 8-72 characters")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
                message = "password must contain an uppercase letter, a lowercase letter and a digit")
        String password,

        /** CITIZEN | RESPONDER | ANALYST | COMMANDER. Defaults to CITIZEN.
         *  ADMIN and COMMANDER are never self-assignable. */
        String role,

        @NotNull(message = "location is required")
        @Valid
        LocationRequest location) {
}
