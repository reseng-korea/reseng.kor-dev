package com.resengkor.management.domain.banner.entity;

import com.resengkor.management.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Period;

@Entity
@Getter
@Builder (toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_request_id", updatable = false)
    private Long id;

    @Column(name = "requested_length", nullable = false)
    private Integer requestedLength;

    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

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
