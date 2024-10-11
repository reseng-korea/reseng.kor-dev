package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder(toBuilder = true)
@AllArgsConstructor  // 모든 필드를 포함하는 생성자 생성
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    //이메일 인증 여부
    //1 : 인증, 0 : 인증x
    @Column(name = "email_status", nullable = false)
    private int emailStatus;

    @Column(name = "password")
    private String password;

    @Column(name = "company_name", unique = true)
    private String companyName;

    @Column(name = "representative_name", unique = true)
    private String representativeName; //실제 이름

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
    private Role role;

    //로그인 유형 : 소셜/로컬
    @Enumerated(EnumType.STRING)
    @Column(name = "member_login_type", nullable = false)
    private LoginType loginType;

    //회원 상태
    //0: 비활성화, 1 : 활성화
    @Column(name = "member_status", nullable = false)
    protected int status;

    //소셜 로그인 제공자
    @Enumerated(EnumType.STRING)
    @Column(name = "member_social_provider")
    private SocialProvider socialProvider;

    //소셜 로그인 id
    @Column(name = "member_social_id", unique = true)
    private String socialId;

    @CreatedDate //엔티티가 생성될 때 생성 시간 저장
    @Column(name = "joined_at")
    private LocalDateTime createdAt;


    @OneToOne(mappedBy = "user")
    private UserProfile userProfile;  // 1:1 관계로 UserInfo 연결

    @Version
    private Integer version;  // 비관적 잠금 처리

    @Builder
    public User(String email, int emailStatus, String password, String companyName, String representativeName, String phoneNumber, Role role, LoginType loginType, int status, SocialProvider socialProvider, String socialId) {
        this.email = email;
        this.emailStatus = emailStatus;
        this.password = password;
        this.companyName = companyName;
        this.representativeName = representativeName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.loginType = loginType;
        this.status = status;
        this.socialProvider = socialProvider;
        this.socialId = socialId;
    }
}
