package com.resengkor.management.domain.order.repository;

import com.resengkor.management.domain.order.entity.OrderHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {

    // 사용자 ID로 발주 내역을 조회하고, orderDate를 기준으로 내림차순 정렬
    @EntityGraph(attributePaths = {"temporaryBannerTypes"})
    List<OrderHistory> findByUserIdOrderByOrderDateDesc(Long userId);

    // 판매자 ID로 발주 내역을 조회하고, orderDate를 기준으로 내림차순 정렬
    @EntityGraph(attributePaths = {"temporaryBannerTypes"})
    List<OrderHistory> findBySellerIdOrderByOrderDateDesc(Long sellerId);

    // 판매자 ID, 주문번호에 해당하는 OrderHistory 조회
    Optional<OrderHistory> findByIdAndSeller_Id(Long id, Long sellerId);

    // 구매자 ID, 주문번호에 해당하는 OrderHistory 조회
    Optional<OrderHistory> findByIdAndBuyer_Id(Long id, Long buyerId);

    // 로그인한 사용자 본인 ID, 주문번호에 해당하는 OrderHistory 조회
    Optional<OrderHistory> findByIdAndUser_Id(Long id, Long userId);
}

