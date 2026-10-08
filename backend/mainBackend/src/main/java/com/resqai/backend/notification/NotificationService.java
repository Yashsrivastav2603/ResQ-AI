package com.resqai.backend.notification;

import com.resqai.backend.common.exception.ResourceNotFoundException;
import com.resqai.backend.common.exception.UnauthorizedException;
import com.resqai.backend.user.Role;
import com.resqai.backend.user.User;
import com.resqai.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void notifyUser(User recipient, NotificationType type, String title, String message,
                           UUID relatedEntityId) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setRelatedEntityId(relatedEntityId);
        repository.save(n);
    }

    /** Fans a notification out to every user holding a given role (e.g. every RESPONDER). */
    @Transactional
    public void notifyRole(Role role, NotificationType type, String title, String message,
                           UUID relatedEntityId) {
        for (User user : userRepository.findByRole(role)) {
            notifyUser(user, type, title, message, relatedEntityId);
        }
    }

    @Transactional
    public void notifyRoles(List<Role> roles, NotificationType type, String title, String message,
                            UUID relatedEntityId) {
        for (Role role : roles) {
            notifyRole(role, type, title, message, relatedEntityId);
        }
    }

    @Transactional(readOnly = true)
    public List<Notification> list(UUID userId) {
        return repository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long unreadCount(UUID userId) {
        return repository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(UUID notificationId, UUID userId) {
        Notification n = repository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification " + notificationId + " not found"));
        if (!n.getRecipient().getId().equals(userId)) {
            throw new UnauthorizedException("This notification does not belong to you");
        }
        n.setRead(true);
        repository.save(n);
    }

    @Transactional
    public void markAllRead(UUID userId) {
        for (Notification n : repository.findByRecipientIdOrderByCreatedAtDesc(userId)) {
            if (!n.isRead()) {
                n.setRead(true);
                repository.save(n);
            }
        }
    }
}