package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.OrderRequestDto;
import com.resengkor.management.domain.banner.dto.OrderResponseDto;
import com.resengkor.management.domain.banner.entity.*;
import com.resengkor.management.domain.banner.mapper.OrderHistoryMapper;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.banner.repository.OrderBannerRepository;
import com.resengkor.management.domain.banner.repository.OrderHistoryRepository;
import com.resengkor.management.domain.banner.repository.TemporaryBannerTypeRepository;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
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
    private final OrderBannerRepository orderBannerRepository;

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

            // 새로운 TemporaryBannerType 생성
            TemporaryBannerType temporaryBannerType = new TemporaryBannerType().toBuilder()
                    .temporaryTypeWidth(bannerOrderItem.getTemporaryTypeWidth())
                    .quantity(bannerOrderItem.getQuantity())
                    .orderHistory(orderHistory)
                    .build();

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
            saveOrderAndBannerTypes(orderHistory);
        }

        // 수령 상태 업데이트
        orderHistory = orderHistory.toBuilder()
                .receiveStatus(receiveStatus)
                .build();

        orderHistoryRepository.save(orderHistory);
    }

    // BannerType을 실제 DB에 저장하는 메서드
    private void saveOrderAndBannerTypes(OrderHistory orderHistory) {
        // temporaryBannerType 리스트 가져오기
        List<TemporaryBannerType> temporaryBannerTypes = orderHistory.getTemporaryBannerTypes();

        // TemporaryBannerType 목록을 순회하면서 BannerType을 먼저 생성한 후 OrderBanner 생성
        for (TemporaryBannerType tempBanner : temporaryBannerTypes) {
            // quantity 개수만큼 BannerType 생성 및 저장
            List<BannerType> createdBannerTypes = new ArrayList<>();
            for (int i = 0; i < tempBanner.getQuantity(); i++) {
                BannerType bannerType = BannerType.builder()
                        .user(orderHistory.getSeller())
                        .typeWidth(tempBanner.getTemporaryTypeWidth())
                        .horizontalLength(BigDecimal.valueOf(120)) // 항상 120로 설정
                        .isStandard(true) // 항상 true로 설정
                        .build();
                bannerTypeRepository.save(bannerType);
                createdBannerTypes.add(bannerType);
            }

            // 모든 BannerType 이 생성된 후, OrderBanner 를 딱 한 번 생성
            if (!createdBannerTypes.isEmpty()) {
                // 첫 번째 생성된 BannerType 참조 (대표로 사용)
                BannerType representativeBannerType = createdBannerTypes.getFirst();

                // OrderBanner 는 딱 한 번만 생성
                OrderBanner orderBanner = OrderBanner.builder()
                        .orderHistory(orderHistory)
                        .bannerType(representativeBannerType)
                        .quantity(tempBanner.getQuantity()) // TemporaryBannerType의 quantity 사용
                        .build();
                orderBannerRepository.save(orderBanner);
            }

            // 생성이 완료된 후, 해당 `TemporaryBannerType`을 삭제
            temporaryBannerTypeRepository.delete(tempBanner);
        }
    }
}
