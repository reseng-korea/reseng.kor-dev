package com.resengkor.management.domain.order.service;

import com.resengkor.management.domain.order.dto.OrderRequestDto;
import com.resengkor.management.domain.order.dto.OrderResponseDto;
import com.resengkor.management.domain.order.dto.ReceivedOrderResponseDto;
import com.resengkor.management.domain.banner.entity.*;
import com.resengkor.management.domain.order.mapper.OrderHistoryMapper;
import com.resengkor.management.domain.order.mapper.ReceivedOrderHistoryMapper;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.order.repository.OrderBannerRepository;
import com.resengkor.management.domain.order.repository.OrderHistoryRepository;
import com.resengkor.management.domain.banner.repository.TemporaryBannerTypeRepository;
import com.resengkor.management.domain.order.entity.OrderBanner;
import com.resengkor.management.domain.order.entity.OrderHistory;
import com.resengkor.management.domain.order.entity.OrderStatus;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

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
    public CommonResponse createOrder(OrderRequestDto orderRequestDto) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

        // 본인(= buyer)
        User loginedUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        // 부모 대리점(= seller) 조회
        User parentAgency = loginedUser;
        if (loginedUser.getRole() != Role.ROLE_MANAGER) {
            parentAgency = getParents(userId);
        }

        // Manager인 경우 처리 로직
        if (loginedUser.getRole() == Role.ROLE_MANAGER) {
            OrderHistory managerOrderHistory = OrderHistory.builder()
                    .orderDate(LocalDate.now())
                    .seller(loginedUser)  // Manager 자신이 seller
                    .buyer(loginedUser)  // Manager 자신이 buyer
                    .orderStatus(OrderStatus.SHIPPED_COURIER)  // 상태는 CONFIRMED
                    .receiveStatus(false)  // 즉시 처리됨으로 true
                    .user(loginedUser)
                    .build();

            // OrderHistoryBannerType 리스트 생성 후 연관 설정
            orderRequestDto.getBannerRequests().forEach(bannerOrderItem -> {
                TemporaryBannerType managerTemporaryBannerType = TemporaryBannerType.builder()
                        .temporaryTypeWidth(bannerOrderItem.getTemporaryTypeWidth())
                        .quantity(bannerOrderItem.getQuantity())
                        .orderHistory(managerOrderHistory)
                        .build();

                temporaryBannerTypeRepository.save(managerTemporaryBannerType);
            });

            // OrderHistory 저장
            orderHistoryRepository.save(managerOrderHistory);
            return new CommonResponse(ResponseStatus.MANAGER_CREATED_SUCCESS.getCode(),
                    ResponseStatus.MANAGER_CREATED_SUCCESS.getMessage());
        }

        try {
            // 일반 사용자 처리 로직
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

            return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(), ResponseStatus.CREATED_SUCCESS.getMessage());

        } catch (Exception e) {
            throw new CustomException(ExceptionStatus.USER_NOT_FOUND);
        }
    }

    // 부모 대리점(= seller) 조회
    private User getParents(Long userId) throws NoSuchElementException {
        List<User> ancestors = roleHierarchyRepository.findAncestorRoles(userId);

        if (ancestors.size() > 1) {
            throw new CustomException(ExceptionStatus.MULTIPLE_ANCESTOR_ROLES);
        } else if (ancestors.isEmpty()) {
            throw new CustomException(ExceptionStatus.PARENT_AGENCY_NOT_FOUND);
        }
        return ancestors.getFirst();
    }

    // 로그인한 사용자의 모든 발주 내역 조회
    public DataResponse<List<OrderResponseDto>> getUserOrderHistories() {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        List<OrderHistory> orderHistories = orderHistoryRepository.findByUserIdOrderByOrderDateDesc(userId);
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), orderHistoryMapper.toDtoList(orderHistories));
    }

    // 특정 orderId로 발주 내역 조회
    public DataResponse<OrderResponseDto> getUserOrderHistoryById(Long orderId) {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        OrderHistory orderHistory = orderHistoryRepository.findByIdAndUser_Id(orderId, userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), orderHistoryMapper.toDto(orderHistory));
    }

    // 수령 상태 업데이트 메서드
    @Transactional
    public CommonResponse updateReceiveStatus(Long orderId, boolean receiveStatus) {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        OrderHistory orderHistory = orderHistoryRepository.findByIdAndBuyer_Id(orderId, userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.ORDER_NOT_FOUND));

        // 배송상태가 미확인이거나 확인 상태인 경우 수령상태 변경 불가
        if (orderHistory.getOrderStatus() == OrderStatus.UNCONFIRMED || orderHistory.getOrderStatus() == OrderStatus.CONFIRMED) {
            throw new CustomException(ExceptionStatus.INVALID_REQUEST_STATE);
        }

        // 수령 상태가 true로 변경되면, BannerType을 DB에 저장
        if (receiveStatus && !orderHistory.getReceiveStatus()) {
            saveOrderAndBannerTypes(orderHistory);
            orderHistory.updateReceiveStatus(true);
        }

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage());
    }

    // BannerType을 실제 DB에 저장하는 메서드
    protected void saveOrderAndBannerTypes(OrderHistory orderHistory) {
        // temporaryBannerType 리스트 가져오기 (복사본 생성)
        List<TemporaryBannerType> temporaryBannerTypes = new ArrayList<>(orderHistory.getTemporaryBannerTypes());

        // Iterator 사용하여 안전하게 순회하면서 수정
        try {
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
        } catch (Exception e) {
            throw new CustomException(ExceptionStatus.BANNER_SAVE_FAILED);
        }
    }

    // 로그인한 사용자의 모든 발주 내역 조회
    public DataResponse<List<ReceivedOrderResponseDto>> getUserReceivedOrderHistories() {
        Long sellerId = UserAuthorizationUtil.getLoginMemberId();
        List<OrderHistory> orderHistories = orderHistoryRepository.findBySellerIdOrderByOrderDateDesc(sellerId);
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), receivedOrderHistoryMapper.toReceivedDtoList(orderHistories));
    }

    // 배송상태 업데이트 기능
    @Transactional
    public CommonResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long sellerId = UserAuthorizationUtil.getLoginMemberId();
        OrderHistory orderHistory = orderHistoryRepository.findByIdAndSeller_Id(orderId, sellerId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.ORDER_NOT_FOUND));

        OrderStatus currentStatus = orderHistory.getOrderStatus();
        // 보유 재고 수량 체크
        checkBannerStock(sellerId, orderId);
        // 상태 전이 가능 여부 확인
        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new CustomException(ExceptionStatus.INVALID_STATE_TRANSITION);
        }
        orderHistory.updateOrderStatus(newStatus);
        // 배송 완료되면 재고 감소
        if (newStatus.equals(OrderStatus.SHIPPED_COURIER) || newStatus.equals(OrderStatus.SHIPPED_FREIGHT)) {
            try {
                reduceBannerStock(sellerId, orderId);
            } catch (Exception e) {
                throw new CustomException(ExceptionStatus.BANNER_REDUCTION_FAIL);
            }
        }
        orderHistoryRepository.save(orderHistory);
        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage());
    }

    // 보유 현수막 재고 감소 메서드
    private void reduceBannerStock(Long userId, Long orderId) {
        List<TemporaryBannerType> temporaryBannerTypes = temporaryBannerTypeRepository.findByOrderHistoryId(orderId);

        for (TemporaryBannerType temporaryBannerType : temporaryBannerTypes) {
            Integer typeWidth = temporaryBannerType.getTemporaryTypeWidth();
            Integer quantity = temporaryBannerType.getQuantity();

            List<BannerType> bannerTypes = bannerTypeRepository.findByUserIdAndTypeWidth(userId, typeWidth);

            int remainingQuantity = quantity;
            for (BannerType bannerType : bannerTypes) {
                if (remainingQuantity > 0) {
                    bannerTypeRepository.delete(bannerType);
                    remainingQuantity--;
                } else {
                    break;
                }
            }
        }
    }

    // 보유 수량 확인
    private void checkBannerStock(Long userId, Long orderId) {
        List<TemporaryBannerType> temporaryBannerTypes = temporaryBannerTypeRepository.findByOrderHistoryId(orderId);

        for (TemporaryBannerType temporaryBannerType : temporaryBannerTypes) {
            Integer typeWidth = temporaryBannerType.getTemporaryTypeWidth();
            Integer quantity = temporaryBannerType.getQuantity();

            List<BannerType> bannerTypes = bannerTypeRepository.findByUserIdAndTypeWidth(userId, typeWidth);

            int totalAvailableQuantity = bannerTypes.size();

            if (totalAvailableQuantity < quantity) {
                throw new CustomException(ExceptionStatus.INSUFFICIENT_BANNER);
            }
        }
    }
}
