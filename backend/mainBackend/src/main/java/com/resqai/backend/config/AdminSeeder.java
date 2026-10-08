package com.resqai.backend.config;

import com.resqai.backend.location.GeoLocation;
import com.resqai.backend.user.Role;
import com.resqai.backend.user.User;
import com.resqai.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Creates the first ADMIN account on an empty database so somebody can promote
 * commanders and responders. Set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD; if
 * either is missing, nothing is seeded.
 */
@Configuration
public class AdminSeeder {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    @Bean
    public ApplicationRunner seedAdmin(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder,
                                       @Value("${SEED_ADMIN_EMAIL:}") String email,
                                       @Value("${SEED_ADMIN_PASSWORD:}") String password,
                                       @Value("${SEED_ADMIN_LAT:26.8467}") double lat,
                                       @Value("${SEED_ADMIN_LON:80.9462}") double lon) {
        return args -> {
            if (email.isBlank() || password.isBlank()) {
                return;
            }
            if (userRepository.existsByEmailIgnoreCase(email)) {
                return;
            }
            GeoLocation location = new GeoLocation();
            location.setLatitude(lat);
            location.setLongitude(lon);
            location.setRadiusKm(500);

            User admin = new User();
            admin.setName("ResQ AI Administrator");
            admin.setEmail(email.toLowerCase());
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setRole(Role.ADMIN);
            admin.setLocation(location);
            userRepository.save(admin);

            log.info("Seeded initial ADMIN account: {}", email);
        };
    }
}
