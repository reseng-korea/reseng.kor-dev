package com.resengkor.management.domain.mail.repository;

import com.resengkor.management.domain.mail.entity.MailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MailRepository extends JpaRepository<MailVerification, Long> {
    Optional<MailVerification> findByEmail(String email);
}
