package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.OrderBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderBannerRepository extends JpaRepository<OrderBanner, Long> {

}
