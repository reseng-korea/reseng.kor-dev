package com.resengkor.management.domain.banner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "Order_Banner")
@Entity
@Builder(toBuilder = true)
public class OrderBanner {

    @Id
    @GeneratedValue
    @Column(name = "order_banner_id")
    private Long id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_history_id")
    private OrderHistory orderHistory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_type_id")
    private BannerType bannerType;

    // 실제 데이터베이스와 매핑되지 않는 임시 필드
    @Transient
    private BannerType transientBannerType;

    // BannerType을 임시에서 실제 필드로 이동하는 메서드
    public void applyTransientBannerType() {
        if (this.transientBannerType != null) {
            this.bannerType = this.transientBannerType;
        }
    }
}
