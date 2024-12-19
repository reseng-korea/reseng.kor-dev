package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.order.entity.OrderBanner;
import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class BannerType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_type_id", updatable = false)
    private Long id;

    @Column(name = "type_width", nullable = false)
    private Integer typeWidth;

    @Column(name = "horizontal_length", nullable = false, precision = 8, scale = 5)
    private BigDecimal horizontalLength;

    @Column(name = "is_standard", nullable = false)
    private Boolean isStandard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "bannerType", cascade = CascadeType.ALL)
    private List<OrderBanner> orderBanners;

    @Override
    public String toString() {
        return "BannerType{" +
                "id=" + id +
                ", typeWidth=" + typeWidth +
                ", horizontalLength=" + horizontalLength +
                ", isStandard=" + isStandard +
                ", user=" + user +
                '}';
    }
}

