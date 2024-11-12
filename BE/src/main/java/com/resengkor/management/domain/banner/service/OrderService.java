package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.OrderRequestDto;
import com.resengkor.management.domain.banner.dto.OrderResponseDto;
import com.resengkor.management.domain.banner.dto.ReceivedOrderResponseDto;
import com.resengkor.management.domain.banner.entity.*;
import com.resengkor.management.domain.banner.mapper.OrderHistoryMapper;
import com.resengkor.management.domain.banner.mapper.ReceivedOrderHistoryMapper;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.banner.repository.OrderBannerRepository;
import com.resengkor.management.domain.banner.repository.OrderHistoryRepository;
import com.resengkor.management.domain.banner.repository.TemporaryBannerTypeRepository;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import jakarta.persistence.EntityManager;
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
    private final ReceivedOrderHistoryMapper receivedOrderHistoryMapper;

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
    public List<OrderResponseDto> getUserOrderHistories() {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

        // 사용자의 모든 발주내역 가져오기
        List<OrderHistory> orderHistories = orderHistoryRepository.findByUserIdOrderByOrderDateDesc(userId);

        // DTO로 변환하여 반환
        return orderHistoryMapper.toDtoList(orderHistories);
    }

    // 특정 orderId로 발주 내역 조회
    public OrderResponseDto getUserOrderHistoryById(Long orderId) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

        // 현재 로그인된 사용자와 주어진 orderId에 해당하는 발주 내역 조회
        OrderHistory orderHistory = orderHistoryRepository.findByUserIdAndId(userId, orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // DTO로 변환하여 반환
        return orderHistoryMapper.toDto(orderHistory);
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
            orderHistory.updateReceiveStatus(true);
        }
    }

    // BannerType을 실제 DB에 저장하는 메서드
    protected void saveOrderAndBannerTypes(OrderHistory orderHistory) {

        // temporaryBannerType 리스트 가져오기 (복사본 생성)
        List<TemporaryBannerType> temporaryBannerTypes = new ArrayList<>(orderHistory.getTemporaryBannerTypes());

        // Iterator 사용하여 안전하게 순회하면서 수정
        for (TemporaryBannerType tempBanner : temporaryBannerTypes) {

            // quantity 개수만큼 BannerType 생성 및 저장
            List<BannerType> createdBannerTypes = new ArrayList<>();
            for (int i = 0; i < tempBanner.getQuantity(); i++) {
                BannerType bannerType = BannerType.builder()
                        .user(orderHistory.getBuyer())
                        .typeWidth(tempBanner.getTemporaryTypeWidth())
                        .horizontalLength(BigDecimal.valueOf(120)) // 항상 120로 설정
                        .isStandard(true) // 항상 true로 설정
                        .build();
                bannerTypeRepository.save(bannerType);
                createdBannerTypes.add(bannerType);
            }

            // 모든 BannerType 이 생성된 후, OrderBanner 를 딱 한 번 생성
            if (!createdBannerTypes.isEmpty()) {
                BannerType representativeBannerType = createdBannerTypes.getFirst();

                OrderBanner orderBanner = OrderBanner.builder()
                        .orderHistory(orderHistory)
                        .bannerType(representativeBannerType)
                        .quantity(tempBanner.getQuantity()) // TemporaryBannerType의 quantity 사용
                        .build();
                orderBannerRepository.save(orderBanner);
            }
        }
    }


    // 로그인한 사용자의 모든 발주 내역 조회
    public List<ReceivedOrderResponseDto> getUserReceivedOrderHistories() {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long sellerId = UserAuthorizationUtil.getLoginMemberId();

        // 로그인 한 아이디와 sellerId가 같은 모든 발주내역 가져오기
        List<OrderHistory> orderHistories = orderHistoryRepository.findBySellerIdOrderByOrderDateDesc(sellerId);

        // DTO로 변환하여 반환
        return receivedOrderHistoryMapper.toReceivedDtoList(orderHistories);
    }

    // 배송상태 업데이트 기능
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus newStatus) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long sellerId = UserAuthorizationUtil.getLoginMemberId();

        OrderHistory orderHistory = orderHistoryRepository.findOrderHistoryByIdAndSellerId(orderId,sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        orderHistory.updateOrderStatus(newStatus);
        orderHistoryRepository.save(orderHistory);
    }
}
