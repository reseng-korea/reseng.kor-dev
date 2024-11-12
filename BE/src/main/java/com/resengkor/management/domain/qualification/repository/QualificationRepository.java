package com.resengkor.management.domain.qualification.repository;

import com.resengkor.management.domain.qualification.entity.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface QualificationRepository extends JpaRepository<Qualification, Long> {
    @Query("SELECT q.fileName FROM Qualification q WHERE q.id = :id")
    Optional<String> findFileNameById(@Param("id") Long id);
}
