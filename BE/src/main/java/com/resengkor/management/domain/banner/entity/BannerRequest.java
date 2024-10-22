package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bannerRequestId;

    @Column(name = "requestted_length", nullable = false)
    private Integer requestedLength;

    @Column(name = "requested_date", nullable = false)
    private LocalDateTime requestedDate;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "posted_date", nullable = false)
    private LocalDateTime postedDate;

    @Column(name = "posted_duration", nullable = false)
    private Period postedDuration;

    @Column(name = "posted_location", nullable = false)
    private String postedLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_type_id", nullable = false)
    private BannerType bannerType;
}
