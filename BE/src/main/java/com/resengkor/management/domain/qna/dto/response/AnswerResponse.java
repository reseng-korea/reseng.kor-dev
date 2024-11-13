package com.resengkor.management.domain.qna.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AnswerResponse {
    private Long answerId;
    private String content;
    private Long questionId;
    private Long adminId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}