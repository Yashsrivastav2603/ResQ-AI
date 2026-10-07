package com.resqai.backend.user;

/**
 * RBAC roles from the architecture. Spring Security sees them as
 * ROLE_ADMIN, ROLE_COMMANDER, ... via {@link #authority()}.
 */
public enum Role {
    CITIZEN,
    RESPONDER,
    ANALYST,
    COMMANDER,
    ADMIN;

    public String authority() {
        return "ROLE_" + name();
    }

    public static Role fromNullable(String raw, Role fallback) {
        if (raw == null || raw.isBlank()) {
            return fallback;
        }
        try {
            return Role.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return fallback;
        }
    }
}
