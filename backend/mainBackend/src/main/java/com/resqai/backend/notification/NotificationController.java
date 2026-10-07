package com.resqai.backend.notification;

import com.resqai.backend.common.ApiResponse;
import com.resqai.backend.notification.dto.NotificationResponse;
import com.resqai.backend.security.AuthenticatedUser;
import com.resqai.backend.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "My notifications, newest first")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> list(@CurrentUser AuthenticatedUser principal) {
        List<NotificationResponse> results = service.list(principal.getId()).stream()
                .map(NotificationResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "How many of my notifications are unread")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount(@CurrentUser AuthenticatedUser principal) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("unread", service.unreadCount(principal.getId()))));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark one notification as read")
    public ResponseEntity<ApiResponse<Void>> markRead(@CurrentUser AuthenticatedUser principal, @PathVariable UUID id) {
        service.markRead(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Marked read", null));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all my notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllRead(@CurrentUser AuthenticatedUser principal) {
        service.markAllRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All marked read", null));
    }
}