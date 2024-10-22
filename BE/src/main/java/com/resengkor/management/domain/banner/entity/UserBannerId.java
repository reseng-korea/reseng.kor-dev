package com.resengkor.management.domain.banner.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class UserBannerId implements Serializable {

    private Long userId;
    private Long bannerTypeId;

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;
        UserBannerId that = (UserBannerId) object;
        return Objects.equals(userId, that.userId) && Objects.equals(bannerTypeId, that.bannerTypeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, bannerTypeId);
    }
}
