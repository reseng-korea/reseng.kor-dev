package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.TemporaryBannerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemporaryBannerTypeRepository extends JpaRepository<TemporaryBannerType, Long> {

    List<TemporaryBannerType> findByOrderHistoryId(Long orderId);

}
