package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.BannerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface BannerTypeRepository extends JpaRepository<BannerType, Long> {

    List<BannerType> findBannerTypesByTypeWidth(Integer typeWidth);

    Optional<BannerType> findByTypeWidthAndHorizontalLength(Integer typeWidth, BigDecimal horizontalLength);
}
