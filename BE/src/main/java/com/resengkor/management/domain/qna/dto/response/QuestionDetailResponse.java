package com.resengkor.management.domain.qna.dto.response;

import com.resengkor.management.domain.qna.entity.Answer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionDetailResponse {
    private String title;

    private String content;

    private boolean isSecret;

    private String password;

    private int viewCount;

    private Long userId;

    private String representativeName;

    private LocalDateTime createdAt;

    private boolean isAnswered;
}
