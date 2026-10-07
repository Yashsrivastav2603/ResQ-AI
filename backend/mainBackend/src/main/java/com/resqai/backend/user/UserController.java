package com.resqai.backend.user;

import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.location.dto.LocationRequest;
import com.resqai.backend.security.AuthenticatedUser;
import com.resqai.backend.security.CurrentUser;
import com.resqai.backend.user.dto.UpdateProfileRequest;
import com.resqai.backend.user.dto.UpdateRoleRequest;
import com.resqai.backend.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Current user profile including registered location")
    public ResponseEntity<ApiResponse<UserResponse>> me(@CurrentUser AuthenticatedUser principal) {
        return ResponseEntity.ok(ApiResponse.ok(UserResponse.from(userService.require(principal.getId()))));
    }

    @PatchMapping("/me")
    @Operation(summary = "Update name / phone")
    public ResponseEntity<ApiResponse<UserResponse>> updateMe(
            @CurrentUser AuthenticatedUser principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        User updated = userService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", UserResponse.from(updated)));
    }

    @PutMapping("/me/location")
    @Operation(summary = "Replace the registered location (re-scopes the Disaster News feed)")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyLocation(
            @CurrentUser AuthenticatedUser principal,
            @Valid @RequestBody LocationRequest request) {
        User updated = userService.updateLocation(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Location updated", UserResponse.from(updated)));
    }

    // ---------------------------------------------------------------- admin

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users (ADMIN)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Page<User> users = userService.list(
                PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.ok(users.map(UserResponse::from).getContent()));
    }

    @PatchMapping("/admin/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Change a user's role or enable/disable them (ADMIN)")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoleRequest request) {
        User updated = userService.updateRoleAndStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("User updated", UserResponse.from(updated)));
    }
}
