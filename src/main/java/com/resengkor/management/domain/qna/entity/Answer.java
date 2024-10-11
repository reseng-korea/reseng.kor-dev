package com.resengkor.management.domain.qna.entity;

import com.resengkor.management.domain.user.entity.User;
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
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id", updatable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @CreatedDate //엔티티가 생성될 때 생성 시간 저장
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate //엔티티가 수정될 때 수정 시간 저장
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
