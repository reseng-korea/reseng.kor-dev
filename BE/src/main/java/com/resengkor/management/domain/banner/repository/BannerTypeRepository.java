package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.BannerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BannerTypeRepository extends JpaRepository<BannerType, Long> {

    @Query("SELECT bt FROM BannerType bt WHERE bt.user.id = :userId")
    List<BannerType> findByUserId(@Param("userId") Long userId);

    List<BannerType> findByUserIdAndTypeWidth(Long userId, Integer typeWidth);

}
