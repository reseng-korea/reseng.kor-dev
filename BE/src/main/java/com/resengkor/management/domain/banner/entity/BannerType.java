package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
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
public class BannerType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_type_id", updatable = false)
    private Long id;

    @Column(name = "type_width", nullable = false)
    private Integer typeWidth;

    @Column(name = "horizontal_length", nullable = false)
    private Double horizontalLength;

    @Column(name = "is_standard", nullable = false)
    private Boolean isStandard;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
