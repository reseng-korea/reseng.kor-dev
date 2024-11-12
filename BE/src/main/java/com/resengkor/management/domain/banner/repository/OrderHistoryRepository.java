package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.OrderHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {

    // 사용자 ID로 발주 내역을 조회하고, orderDate를 기준으로 내림차순 정렬
    @EntityGraph(attributePaths = {"temporaryBannerTypes"})
    List<OrderHistory> findByUserIdOrderByOrderDateDesc(Long userId);

    // 사용자 ID, 주문번호에 해당하는 OrderHistory 조회
    Optional<OrderHistory> findByUserIdAndId(Long userId, Long orderHistoryId);
}

