package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.OrderRequestDto;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.entity.OrderHistory;
import com.resengkor.management.domain.banner.entity.OrderStatus;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.banner.repository.OrderHistoryRepository;
import com.resengkor.management.domain.user.entity.RoleHierarchy;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
    private final BannerTypeRepository bannerTypeRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final UserIdentificationService userIdentificationService;


    // 발주 요청
    @Transactional
    public void createOrder(OrderRequestDto orderRequestDto, Authentication authentication) {
        Long userId = userIdentificationService.getUserIdFromAuthentication(authentication);
        // 본인(= buyer)
        User loginedUser = userRepository.findById(userId).orElseThrow();

        // 부모 대리점(= seller) 조회
        RoleHierarchy roleHierarchy = roleHierarchyRepository.findByDescendantAndDepth(userId, 1)
                .orElseThrow(() -> new RuntimeException("Parent agency not found"));
        User parentAgency = roleHierarchy.getAncestor();

        // OrderHistory 생성
        OrderHistory orderHistory = OrderHistory.builder()
                .orderDate(LocalDate.now())
                .seller(parentAgency.getName())      // 부모 대리점 이름
                .buyer(loginedUser.getName())       // 현재 로그인한 사용자 이름
                .orderStatus(OrderStatus.UNCONFIRMED)    // 초기 상태는 UNCONFIRMED(미확인)
                .receiveStatus(false)                // receiveStatus 기본값은 false
                .user(loginedUser)
                .build();

        // BannerType 리스트 생성 후 연관 설정
        request.getBannerRequests().forEach(bannerRequest -> {
            BannerType bannerType = BannerType.builder()
                    .typeWidth(bannerRequest.getTypeWidth())
                    .horizontalLength(bannerRequest.getHorizontalLength())
                    .isStandard(bannerRequest.getIsStandard())
                    .user(loggedInUser)
                    .build();
            orderHistory.addBannerType(bannerType); // OrderHistory와 BannerType 관계 추가
        });

        // OrderHistory 저장
        orderHistoryRepository.save(orderHistory);
    }
}
