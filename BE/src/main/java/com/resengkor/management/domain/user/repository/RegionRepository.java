package com.resengkor.management.domain.user.repository;


import com.resengkor.management.domain.user.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {

    List<Region> findByRegionType(String regionType);

    Optional<Region> findByRegionName(String regionName);

    // 지역 이름과 타입으로 조회하는 메서드
    Optional<Region> findByRegionNameAndRegionType(String regionName, String regionType);

    // 지역id와 타입으로 조회하는 메서드
    Optional<Region> findByIdAndRegionType(Long id, String regionType);
}