package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /*
    - 이메일 가입 인증
    - 이메일 가입 인증 여부
     */

    @Column(name = "password")
    private String password;

    @Column(name = "company_name", unique = true)
    private String companyName;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    /*
    - 핸드폰 번호 인증코드
    - 핸드폰 번호 인증 코드
    - 핸드폰 인증코드 생성시간
    - 휴대폰 인증상태
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ROLE_GUEST;  // 기본값으로 Guest 역할

    /*
    - 로그인 유형
    - 회원 상태
    - 소셜 로그인 제공자
    - 소셜 로그인 id
     */

    @CreatedDate //엔티티가 생성될 때 생성 시간 저장
    @Column(name = "joined_at")
    private LocalDateTime createdAt;


    @OneToOne(mappedBy = "user")
    private UserProfile userProfile;  // 1:1 관계로 UserInfo 연결

    @Version
    private Integer version;  // 비관적 잠금 처리
}
