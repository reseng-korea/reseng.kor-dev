package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Immutable
@Builder(toBuilder = true)
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_history_id", updatable = false)
    private Long id;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @Column(name = "order_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(name = "receive_status", nullable = false)
    private Boolean receiveStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "orderHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderBanner> orderBanners = new ArrayList<>();

    // OrderBanner 추가 메서드 (빌더 패턴 사용)
    public void addOrderBanner(BannerType bannerType, Integer quantity) {
        OrderBanner orderBanner = OrderBanner.builder()
                .orderHistory(this)     // 현재 OrderHistory 객체 설정
                .bannerType(bannerType) // BannerType 설정
                .quantity(quantity)     // 수량 설정
                .build();

        orderBanners.add(orderBanner);   // 리스트에 추가
    }
}

