package com.resengkor.management.domain.banner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BannerType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bannerTypeId;

    @Column(name = "type_width", nullable = false)
    private Integer typeWidth;
}
