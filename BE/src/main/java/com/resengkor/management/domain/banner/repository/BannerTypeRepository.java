package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.BannerType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BannerTypeRepository extends JpaRepository<BannerType, Long> {

    @Query("SELECT bt FROM BannerType bt WHERE bt.user.id = :userId")
    List<BannerType> findByUserId(@Param("userId") Long userId);

    List<BannerType> findByUserIdAndTypeWidth(Long userId, Integer typeWidth);

//    BannerType findByUserIdAndTypeWidthAndHorizontalLength(Long user_id, Integer typeWidth, Double horizontalLength);

    @Query("SELECT b FROM BannerType b WHERE b.user.id = :userId AND b.typeWidth = :typeWidth ORDER BY ABS(b.horizontalLength - :adjustedHorizontalLength) ASC")
    List<BannerType> findClosestByUserIdAndTypeWidth(
            @Param("userId") Long userId,
            @Param("typeWidth") Integer typeWidth,
            @Param("adjustedHorizontalLength") double adjustedHorizontalLength,
            Pageable pageable
    );

    List<BannerType> findBannerTypesByTypeWidth(Integer typeWidth);

    Optional<BannerType> findByTypeWidthAndHorizontalLength(Integer typeWidth, Double horizontalLength);
}
