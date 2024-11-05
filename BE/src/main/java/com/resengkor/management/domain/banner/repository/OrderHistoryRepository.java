package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {

    // 사용자 ID로 발주 내역을 조회하고, orderDate를 기준으로 내림차순 정렬
    List<OrderHistory> findByUserIdOrderByOrderDateDesc(Long userId);
}

