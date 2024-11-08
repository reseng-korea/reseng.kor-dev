package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.OrderRequestDto;
import com.resengkor.management.domain.banner.dto.OrderResponseDto;
import com.resengkor.management.domain.banner.entity.*;
import com.resengkor.management.domain.banner.mapper.OrderHistoryMapper;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.banner.repository.OrderHistoryRepository;
import com.resengkor.management.domain.banner.repository.TemporaryBannerTypeRepository;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    // Repository
    private final UserRepository userRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final BannerTypeRepository bannerTypeRepository;
    private final TemporaryBannerTypeRepository temporaryBannerTypeRepository;

    // Mapper
    private final OrderHistoryMapper orderHistoryMapper;

    // 발주 요청
    @Transactional
    public void createOrder(OrderRequestDto orderRequestDto) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

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
//            BannerType newBannerType = BannerType.builder()
//                    .typeWidth(bannerOrderItem.getTypeWidth())
//                    .horizontalLength(120.0)
//                    .isStandard(true)
//                    .user(loginedUser) // 현재 로그인한 사용자와 연결
//                    .build();

            // 새로운 TemporaryBannerType 생성
            TemporaryBannerType temporaryBannerType = new TemporaryBannerType().toBuilder()
                    .temporaryTypeWidth(bannerOrderItem.getTemporaryTypeWidth())
                    .quantity(bannerOrderItem.getQuantity())
                    .orderHistory(orderHistory)
                    .build();

            // OrderBanner 생성
//            OrderBanner orderBanner = OrderBanner.builder()
//                    .orderHistory(orderHistory)  // 연관된 OrderHistory 설정
//                    .transientBannerType(newBannerType)   // 생성된 임시BannerType(= newBannerType) 설정
//                    .quantity(bannerOrderItem.getQuantity()) // 요청된 배너 수량 설정
//                    .build();

            temporaryBannerTypeRepository.save(temporaryBannerType);
        });

        // OrderHistory 저장
        orderHistoryRepository.save(orderHistory);
    }


    // 로그인한 사용자의 모든 발주 내역 조회
    @Transactional
    public List<OrderResponseDto> getUserOrderHistories() {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

        // 사용자의 모든 발주내역 가져오기
        List<OrderHistory> orderHistories = orderHistoryRepository.findByUserIdOrderByOrderDateDesc(userId);

        // DTO로 변환하여 반환
        return orderHistoryMapper.toDtoList(orderHistories);
    }

    // 수령 상태 업데이트 메서드
    @Transactional
    public void updateReceiveStatus(Long orderId, boolean receiveStatus) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

        // 현재 로그인된 ID와 orderHistoryId 모두 일치하는 주문내역 가져오기
        OrderHistory orderHistory = orderHistoryRepository.findByUserIdAndId(userId, orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 수령 상태가 true로 변경되면, BannerType을 DB에 저장
        if (receiveStatus && !orderHistory.getReceiveStatus()) {
            saveBannerTypesToDb(orderHistory);
        }

        // 수령 상태 업데이트
        orderHistory = orderHistory.toBuilder()
                .receiveStatus(receiveStatus)
                .build();

        orderHistoryRepository.save(orderHistory);
    }

    // BannerType을 실제 DB에 저장하는 메서드
    private void saveBannerTypesToDb(OrderHistory orderHistory) {
//        orderHistory.getOrderBanners().forEach(orderBanner -> {
//            // confirmOrder처럼 transientBannerType을 bannerType으로 설정
////            orderBanner = orderBanner.toBuilder()
////                    .bannerType(orderBanner.getTransientBannerType())
////                    .build();
//
//            BannerType bannerType = BannerType.builder()
//                    .typeWidth(orderBanner.getBannerType().getTypeWidth())
//                    .horizontalLength(orderBanner.getBannerType().getHorizontalLength())
//                    .isStandard(orderBanner.getBannerType().getIsStandard())
//                    .user(orderHistory.getUser())
//                    .build();
//
//            // BannerType을 DB에 저장
//            bannerTypeRepository.save(bannerType);
//        });
    }
}
