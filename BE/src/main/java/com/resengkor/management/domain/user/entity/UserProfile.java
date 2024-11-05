package com.resengkor.management.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.resengkor.management.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
@Getter
@Entity
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullAddress;//전체주소

    @Column
    private Double latitude; //위도

    @Column
    private Double longitude; //경도

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id") // 외래 키 정의
    private Region city;  // 도시 정보

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id") // 외래 키 정의
    private Region district;  // 구 정보

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public void updateUserProfile(String fullAddress, Region city, Region district) {
        this.fullAddress = fullAddress;
        this.city = city;
        this.district = district;
    }

    public void updateUser(User user) {
        this.user = user;
    }

}
