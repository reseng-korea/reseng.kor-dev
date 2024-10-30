package com.resengkor.management.domain.user.entity;

import com.resengkor.management.domain.qna.entity.Question;
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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    //이메일 인증 여부
    @Column(name = "email_status", nullable = false)
    private boolean emailStatus;

    @Column(name = "password")
    private String password;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "representative_name")
    private String representativeName; //실제 이름

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    //핸드폰 번호 인증 여부
    @Column(name = "phone_number_status", nullable = false)
    private boolean phoneNumberStatus;

    /*
    - 핸드폰 번호 인증 코드
    - 핸드폰 인증코드 생성시간
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
    protected boolean status;

    //소셜 로그인 제공자
    @Enumerated(EnumType.STRING)
    @Column(name = "member_social_provider")
    private SocialProvider socialProvider;

    //소셜 로그인 id
    @Column(name = "member_social_id")
    private String socialId;

    @CreatedDate //엔티티가 생성될 때 생성 시간 저장
    @Column(name = "joined_at")
    private LocalDateTime createdAt;


    @OneToOne(mappedBy = "user")
    private UserProfile userProfile;  // 1:1 관계로 UserInfo 연결

    @OneToMany(mappedBy = "user")
    private List<Question> questions;

    @Version
    private Integer version;  // 비관적 잠금 처리

    //사용자 비밀번호 수정
    public void editPassword(String password){
        this.password = password;
    }

    //사용자 회원탈퇴 처리
    public void editStatus(boolean status){
        this.status = status;
    }

    //사용자 정보 수정
    public void updateUser(String email, String companyName, String representativeName, String phoneNumber){
        this.email = email;
        this.companyName = companyName;
        this.representativeName = representativeName;
        this.phoneNumber = phoneNumber;
    }

    //양방향 연관관계 메소드
    public void changeUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
        userProfile.updateUser(this);
    }
}
