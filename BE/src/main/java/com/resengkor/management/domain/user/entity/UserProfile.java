package com.resengkor.management.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class UserProfile {

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

    @CreatedDate //엔티티가 생성될 때 생성 시간 저장
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate //엔티티가 수정될 때 수정 시간 저장
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
