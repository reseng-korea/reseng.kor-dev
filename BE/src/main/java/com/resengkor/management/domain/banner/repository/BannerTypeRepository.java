package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.BannerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerTypeRepository extends JpaRepository<BannerType, Long> {

    List<BannerType> findBannerTypesByTypeWidth(Integer typeWidth);

}
