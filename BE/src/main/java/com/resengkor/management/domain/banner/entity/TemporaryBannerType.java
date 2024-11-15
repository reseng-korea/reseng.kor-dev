package com.resengkor.management.domain.banner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TemporaryBannerType {

    @Id
    @GeneratedValue
    @Column(name = "temporary_banner_type_id", nullable = false)
    private Long id;

    @Column(name = "temporary_type_width", nullable = false)
    private Integer temporaryTypeWidth;

    @Column(name = "temporary_type_quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "order_history_id", nullable = false)
    private OrderHistory orderHistory;

}
