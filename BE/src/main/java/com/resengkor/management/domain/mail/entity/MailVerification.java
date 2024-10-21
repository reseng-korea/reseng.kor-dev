package com.resengkor.management.domain.mail.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@AllArgsConstructor  // 모든 필드를 포함하는 생성자 생성
@Builder
public class MailVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(name = "verification_code", nullable = false)
    private String verificationCode;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified;

    private static final int EXPIRATION_TIME_MINUTES = 15; // 인증 코드 유효 기간 (분)

    // 인증 완료 메서드
    public MailVerification verify() {
        return MailVerification.builder()
                .id(this.id)
                .email(this.email)
                .verificationCode(this.verificationCode)
                .issuedAt(this.issuedAt)
                .isVerified(true) // isVerified를 true로 설정
                .build();
    }

    // 인증 코드 유효성 체크
    public boolean isExpired() {
        return issuedAt.plusMinutes(EXPIRATION_TIME_MINUTES).isBefore(LocalDateTime.now());
    }

}
