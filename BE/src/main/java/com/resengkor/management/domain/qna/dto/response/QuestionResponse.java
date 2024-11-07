package com.resengkor.management.domain.qna.dto.response;

import com.resengkor.management.domain.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionResponse {
    private String title;

    private boolean isSecret;

    private int viewCount;

    private Long userId;

    private String representativeName;

    private LocalDateTime createdAt;
}
