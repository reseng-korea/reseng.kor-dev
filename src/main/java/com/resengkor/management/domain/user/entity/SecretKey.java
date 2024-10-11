package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder(toBuilder = true)
@AllArgsConstructor  // 모든 필드를 포함하는 생성자 생성
public class SecretKey {
    @Column(name = "secret_key", nullable = false)
    private String secretKey;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", unique = true, nullable = false)
    private User admin;
}

