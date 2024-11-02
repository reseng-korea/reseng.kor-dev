package com.resengkor.management.domain.qrcode.entity;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QR {

    @Id
    @GeneratedValue
    @Column(name = "qr_id", nullable = false)
    private Long id;

    @Column(name = "uuid", nullable = false)
    private String uuid;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt;

    @Column(name = "generated_url", nullable = false)
    private String generatedUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_requested_id", nullable = false)
    private BannerRequest bannerRequest;

}

