package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.OrderRequestDto;
import com.resengkor.management.domain.banner.dto.OrderResponseDto;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.entity.OrderBanner;
import com.resengkor.management.domain.banner.entity.OrderHistory;
import com.resengkor.management.domain.banner.entity.OrderStatus;
import com.resengkor.management.domain.banner.mapper.OrderHistoryMapper;
import com.resengkor.management.domain.banner.repository.OrderHistoryRepository;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final UserIdentificationService userIdentificationService;
    private final OrderHistoryMapper orderHistoryMapper;

    private Long getUserId(Authentication authentication) {
        // 로그인한 사용자 ID 가져오기
        return userIdentificationService.getUserIdFromAuthentication(authentication);
    }

    // 발주 요청
    @Transactional
    public void createOrder(OrderRequestDto orderRequestDto, Authentication authentication) {
        Long userId = getUserId(authentication);

        // 본인(= buyer)
        User loginedUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 부모 대리점(= seller) 조회
        User parentAgency = roleHierarchyRepository.findAncestorRole(userId)
                .orElseThrow(()-> new RuntimeException("Parent agency not found"));

        // OrderHistory 생성
        OrderHistory orderHistory = OrderHistory.builder()
                .orderDate(LocalDate.now())
                .seller(parentAgency)  // 부모 대리점
                .buyer(loginedUser)    // 현재 로그인한 사용자
                .orderStatus(OrderStatus.UNCONFIRMED)    // 초기 상태는 UNCONFIRMED(미확인)
                .receiveStatus(false)  // receiveStatus 기본값은 false
                .user(loginedUser)
                .build();

        // OrderHistoryBannerType 리스트 생성 후 연관 설정
        orderRequestDto.getBannerRequests().forEach(bannerOrderItem -> {
            // 새로운 BannerType 생성 (데이터베이스에 즉시 저장하지 않음)
            BannerType newBannerType = BannerType.builder()
                    .typeWidth(bannerOrderItem.getTypeWidth())
                    .horizontalLength(120.0)
                    .isStandard(true)
                    .user(loginedUser) // 현재 로그인한 사용자와 연결
                    .build();

            // OrderBannerType 생성
            OrderBanner orderBanner = OrderBanner.builder()
                    .orderHistory(orderHistory)  // 연관된 OrderHistory 설정
                    .bannerType(newBannerType)   // 생성된 BannerType 설정
                    .quantity(bannerOrderItem.getQuantity()) // 요청된 배너 수량 설정
                    .build();

            // OrderHistory와 OrderBanner의 연관 관계 설정
            orderHistory.addOrderBanner(newBannerType, bannerOrderItem.getQuantity());
        });

        // OrderHistory 저장 (Cascade 설정을 통해 BannerType도 함께 저장)
        orderHistoryRepository.save(orderHistory);
    }


    // 로그인한 사용자의 모든 발주 내역 조회
    public List<OrderResponseDto> getUserOrderHistories(Authentication authentication) {
        Long userId = getUserId(authentication);

        List<OrderHistory> orderHistories = orderHistoryRepository.findByUserIdOrderByOrderDateDesc(userId);
        return orderHistoryMapper.toDtoList(orderHistories);
    }
}
