package com.resengkor.management.domain.order.repository;

import com.resengkor.management.domain.order.entity.OrderBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderBannerRepository extends JpaRepository<OrderBanner, Long> {

}
