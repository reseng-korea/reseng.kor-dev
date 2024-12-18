package com.resengkor.management.domain.user.entity;

import com.resengkor.management.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder(toBuilder = true)
@AllArgsConstructor  // 모든 필드를 포함하는 생성자 생성
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    //이메일 인증 여부
    //0:인증x, 1: 인증
    @Builder.Default
    @Column(name = "email_status", nullable = false)
    private boolean emailStatus = false;

    @Column(name = "password")
    private String password;

    //임시 비밀번호 여부
    //0:임시 비번X, 1: 임시 비번 사용중
    @Builder.Default
    @Column(name = "temporary_password")
    private boolean temporaryPasswordStatus = false;

    @Column(name = "company_name", nullable = false)
    private String companyName; //아이디 찾기에 이용. 필수

    @Column(name = "representative_name")
    private String representativeName; //실제 이름

    @Column(name = "phone_number", unique = true)
    private String phoneNumber; //구글소셜에서 핸드폰 번호 제공x

    //핸드폰 번호 인증 여부
    //0:인증x, 1: 인증
    @Builder.Default
    @Column(name = "phone_number_status", nullable = false)
    private boolean phoneNumberStatus = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    //로그인 유형 : 소셜/로컬
    @Enumerated(EnumType.STRING)
    @Column(name = "member_login_type", nullable = false)
    private LoginType loginType;

    //회원 상태
    //0: 비활성화, 1 : 활성화
    @Builder.Default
    @Column(name = "member_status", nullable = false)
    private boolean status = true;

    //소셜 로그인 제공자
    @Enumerated(EnumType.STRING)
    @Column(name = "member_social_provider")
    private SocialProvider socialProvider;

    //소셜 로그인 id
    @Column(name = "member_social_id")
    private String socialId;

    @OneToOne(mappedBy = "user")
    private UserProfile userProfile;  // 1:1 관계로 UserInfo 연결

    @Version
    private Integer version;  // 비관적 잠금 처리

    //사용자 비밀번호 수정
    public void editPassword(String password){
        this.password = password;
    }

    //임시 비번 변경
    public void editTemporaryPasswordStatus(boolean temporaryPasswordStatus){
        this.temporaryPasswordStatus =  temporaryPasswordStatus;
    }

    //사용자 회원탈퇴 처리
    public void editStatus(boolean status){
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    //사용자 정보 수정
    public void updateUser(String email, String companyName, String representativeName, String phoneNumber){
        this.email = email;
        this.companyName = companyName;
        this.representativeName = representativeName;
        this.phoneNumber = phoneNumber;
    }

    // oauthUpdateUser에서 사용됨.
    public void updateStatusAndRole(boolean emailStatus, boolean phoneNumberStatus, Role role){
        this.emailStatus = emailStatus;
        this.phoneNumberStatus = phoneNumberStatus;
        this.role = role;
    }

    //양방향 연관관계 메소드
    public void updateUserUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
        if (userProfile != null) {
            userProfile.updateUser(this);  // UserProfile에 User 설정
        }
    }

    public void updateUserRole(Role role) {
        this.role = role;
    }
}
