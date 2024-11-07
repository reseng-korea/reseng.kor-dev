package com.resengkor.management.domain.faq.repository;

import com.resengkor.management.domain.faq.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FAQRepository extends JpaRepository<Faq, Long> {
}
