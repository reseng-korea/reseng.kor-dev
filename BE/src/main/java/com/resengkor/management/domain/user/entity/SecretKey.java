package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder(toBuilder = true)
@AllArgsConstructor  // 모든 필드를 포함하는 생성자 생성
public class SecretKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "secretKey_id", updatable = false)
    private Long id;

    @Column(name = "secretKey_name", nullable = false)
    private String secretKey;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User admin;
}

