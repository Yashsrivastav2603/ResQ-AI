package com.resqai.backend.notification.dto;

import com.resqai.backend.notification.Notification;
import com.resqai.backend.notification.NotificationType;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id, NotificationType type, String title, String message,
        UUID relatedEntityId, boolean read, Instant createdAt) {

    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(n.getId(), n.getType(), n.getTitle(), n.getMessage(),
                n.getRelatedEntityId(), n.isRead(), n.getCreatedAt());
    }
}