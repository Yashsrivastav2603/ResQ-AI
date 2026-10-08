package com.resqai.backend.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ResourceRepository extends JpaRepository<Resource, UUID> {
    List<Resource> findByType(ResourceType type);
    List<Resource> findByStatus(ResourceStatus status);
}