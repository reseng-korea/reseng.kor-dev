package com.resengkor.management.domain.mail.repository;

import com.resengkor.management.domain.mail.entity.MailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MailRepository extends JpaRepository<MailVerification, Long> {
    Optional<MailVerification> findByEmail(String email);

    @Query(value = "SELECT * FROM mail_verification mv WHERE mv.email = :email ORDER BY mv.issued_at DESC LIMIT 1", nativeQuery = true)
    Optional<MailVerification> findLatestByEmail(@Param("email") String email);
}
