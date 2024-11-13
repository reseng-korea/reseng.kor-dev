package com.resengkor.management.domain.qna.entity;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.entity.UserProfile;
import com.resengkor.management.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;


@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder(toBuilder = true)
@AllArgsConstructor
public class Question extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id", updatable = false)
    private Long id;

    @Column(name = "question_title", nullable = false)
    private String title;

    @Column(name = "question_content", nullable = false, columnDefinition = "VARCHAR(500 CHAR)")
    private String content;

    @Column(name = "question_is_secret", nullable = false)
    private boolean isSecret;

    @Column(name = "question_password")
    private String password;

    @Builder.Default
    @Column(name = "question_view_count", nullable = false)
    private int viewCount = 0; // 기본값 0

    @Builder.Default
    @Column(name = "question_is_answered", nullable = false)
    private boolean isAnswered = false; // 응답 상태 기본값 false

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Answer answer;

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void updateQuestion(String title, String content, boolean isSecret, String password) {
        this.title = title;
        this.content = content;
        this.isSecret = isSecret;
        this.password = password;
    }

    public void updateAnswer(Answer answer) {
        this.answer = answer;
        if (answer != null) {
            this.isAnswered = true; // 응답이 있을 경우 상태 업데이트
        } else {
            this.isAnswered = false; // 응답이 없으면 상태 false로 설정
        }
    }

}
