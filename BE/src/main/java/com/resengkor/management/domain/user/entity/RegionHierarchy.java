package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class RegionHierarchy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "region_id", name = "ancestor_region_id", nullable = false)
    private Region ancestorRegion;  // 상위 지역

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "region_id", name = "descendant_region_id", nullable = false)
    private Region descendantRegion;  // 하위 지역

    @Column(nullable = false)
    private int depth;  // 관계 깊이

    @Builder
    public RegionHierarchy(Region ancestorRegion, Region descendantRegion, int depth) {
        this.ancestorRegion = ancestorRegion;
        this.descendantRegion = descendantRegion;
        this.depth = depth;
    }
}