package com.resengkor.management.domain.qna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerRequest {
    @NotBlank(message = "내용은 필수 입력 값입니다.")
    private String content;
    private Long questionId;
}