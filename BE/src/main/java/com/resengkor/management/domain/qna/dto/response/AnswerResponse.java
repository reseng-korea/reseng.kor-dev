package com.resengkor.management.domain.qna.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerResponse {
    private Long id;
    private String content;
    private Long questionId;
    private Long adminId;
}