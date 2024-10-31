package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerRequestRepository extends JpaRepository<BannerRequest, Long> {
}
