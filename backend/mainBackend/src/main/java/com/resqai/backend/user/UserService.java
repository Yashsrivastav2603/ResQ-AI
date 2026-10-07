package com.resqai.backend.user;

import com.resqai.backend.common.exception.BadRequestException;
import com.resqai.backend.common.exception.ResourceNotFoundException;
import com.resqai.backend.location.GeoLocation;
import com.resqai.backend.location.GeocodingService;
import com.resqai.backend.location.dto.LocationRequest;
import com.resqai.backend.user.dto.UpdateProfileRequest;
import com.resqai.backend.user.dto.UpdateRoleRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final GeocodingService geocodingService;

    public UserService(UserRepository userRepository, GeocodingService geocodingService) {
        this.userRepository = userRepository;
        this.geocodingService = geocodingService;
    }

    @Transactional(readOnly = true)
    public User require(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User " + id + " not found"));
    }

    @Transactional
    public User updateProfile(UUID id, UpdateProfileRequest request) {
        User user = require(id);
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone().isBlank() ? null : request.phone().trim());
        }
        return userRepository.save(user);
    }

    /**
     * Updates the registered location. Everything the Disaster News module does
     * keys off this, so it is re-geocoded exactly like registration.
     */
    @Transactional
    public User updateLocation(UUID id, LocationRequest request) {
        User user = require(id);
        GeoLocation resolved = geocodingService.resolve(request);
        // Preserve the previously chosen radius when the caller did not send one.
        if (resolved.getRadiusKm() == null && user.getLocation() != null) {
            resolved.setRadiusKm(user.getLocation().getRadiusKm());
        }
        user.setLocation(resolved);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<User> list(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User updateRoleAndStatus(UUID id, UpdateRoleRequest request) {
        User user = require(id);
        Role role;
        try {
            role = Role.valueOf(request.role().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Unknown role '" + request.role()
                    + "'. Valid roles: CITIZEN, RESPONDER, ANALYST, COMMANDER, ADMIN.");
        }
        user.setRole(role);
        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }
        return userRepository.save(user);
    }
}
