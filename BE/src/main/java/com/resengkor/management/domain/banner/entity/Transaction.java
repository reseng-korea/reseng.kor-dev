package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Immutable
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @Column(name = "transcation_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "length_per_bundle", nullable = false)
    private Integer lengthPerBundle;

    @Column(name = "seller", nullable = false)
    private String seller;

    @Column(name = "buyer", nullable = false)
    private String buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_type", nullable = false)
    private BannerType bannerType;
}
