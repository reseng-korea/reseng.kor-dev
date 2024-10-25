package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.BannerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BannerTypeRepository extends JpaRepository<BannerType, Long> {

    Optional<BannerType> findBannerTypeBy(Integer typeWidth);
}
