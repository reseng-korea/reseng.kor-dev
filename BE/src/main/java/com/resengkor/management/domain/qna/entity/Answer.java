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
public class Answer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id", updatable = false)
    private Long id;

    @Column(name = "answer_content", nullable = false, columnDefinition = "VARCHAR(500)")
    private String content;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User admin;

    // 연관관계 메소드
    public void updateAnswerQuestion(Question question) {
        this.question = question;
        if (question != null) {
            question.updateAnswer(this);// Question에 Answer 설정
        }
    }

    public void updateContent(String content) {
        if (content != null) {
            this.content = content;
        }
    }
}
