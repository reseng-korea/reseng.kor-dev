package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id")  // 변경
    private Long id;

    @Column(nullable = false)
    private String regionName;  // 지역명

    @Column(nullable = false)
    private String regionType;  // enum인가?

    @Builder
    public Region(String regionName, String regionType) {
        this.regionName = regionName;
        this.regionType = regionType;
    }

}

