package com.resengkor.management.domain.qna.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionAnswerResponse {
    private String title;

    private String content;

    private boolean isSecret;

    private String password;

    private int viewCount;

    private Long userId;

    private String representativeName;

    private LocalDateTime createdAt;

    private AnswerResponse answer;

    private boolean isAnswered;
}
