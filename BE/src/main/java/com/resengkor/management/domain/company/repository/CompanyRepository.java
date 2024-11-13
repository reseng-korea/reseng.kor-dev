package com.resengkor.management.domain.company.repository;

import com.resengkor.management.domain.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
