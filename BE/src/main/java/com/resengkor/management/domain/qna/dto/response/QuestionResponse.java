package com.resengkor.management.domain.qna.dto.response;

import com.resengkor.management.domain.user.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponse {
    private String title;

    private String content;

    private boolean isSecret;

    private String password;

    private int viewCount;

    private User user;
}
