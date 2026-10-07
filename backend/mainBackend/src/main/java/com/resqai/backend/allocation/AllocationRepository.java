package com.resqai.backend.allocation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AllocationRepository extends JpaRepository<Allocation, UUID> {
    List<Allocation> findByIncidentId(UUID incidentId);
    List<Allocation> findByStatus(AllocationStatus status);
}