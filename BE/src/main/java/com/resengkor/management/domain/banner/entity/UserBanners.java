package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserBanners {

    @EmbeddedId
    private UserBannerId userBannerId;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @MapsId("bannerTypeId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_type_id")
    private BannerType bannerType;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "length_per_bundle", nullable = false)
    private Integer lengthPerBundle;
}
