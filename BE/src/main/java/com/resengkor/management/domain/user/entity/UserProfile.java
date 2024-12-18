package com.resengkor.management.domain.user.entity;


import com.resengkor.management.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
@Getter
@Entity
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String companyPhoneNumber;

    @Column
    private String faxNumber;

    @Column(nullable = false)
    private String streetAddress; //도로명 주소

    @Column(nullable = false)
    private String detailAddress; //상세 주소

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

    public void updateUserProfile(String companyPhoneNumber,String faxNumber, String streetAddress, String detailAddress, Region city, Region district) {
        this.companyPhoneNumber = companyPhoneNumber;
        this.faxNumber = faxNumber;
        this.streetAddress = streetAddress;
        this.detailAddress = detailAddress;
        this.city = city;
        this.district = district;
    }

    public void updateUser(User user) {
        this.user = user;
    }

}
