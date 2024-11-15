package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
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

    // 양방향 매핑 추가
    @OneToMany(mappedBy = "orderHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TemporaryBannerType> temporaryBannerTypes = new ArrayList<>();

    // 수령 상태를 업데이트하는 비즈니스 메서드
    public void updateReceiveStatus(boolean newReceiveStatus) {
        this.receiveStatus = newReceiveStatus;
    }

    // 상태 업데이트 메서드
    public void updateOrderStatus(OrderStatus newStatus) {
        this.orderStatus = newStatus;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;
        OrderHistory that = (OrderHistory) object;
        return Objects.equals(id, that.id) && Objects.equals(orderDate, that.orderDate) && Objects.equals(seller, that.seller) && Objects.equals(buyer, that.buyer) && orderStatus == that.orderStatus && Objects.equals(receiveStatus, that.receiveStatus) && Objects.equals(user, that.user) && Objects.equals(temporaryBannerTypes, that.temporaryBannerTypes);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, orderDate, seller, buyer, orderStatus, receiveStatus, user, temporaryBannerTypes);
    }
}


