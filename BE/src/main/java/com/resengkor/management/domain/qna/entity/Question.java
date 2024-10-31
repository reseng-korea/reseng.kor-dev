package com.resengkor.management.domain.qna.entity;

import com.resengkor.management.domain.user.entity.User;
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

    @Column(name = "question_content", nullable = false)
    private String content;

    @Column(name = "question_is_secret", nullable = false)
    private boolean isSecret;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Answer answer;

}
