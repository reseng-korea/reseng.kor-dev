package com.resengkor.management.domain.qna.dto;

import com.resengkor.management.domain.qna.dto.request.AnswerRequest;
import com.resengkor.management.domain.qna.dto.request.QuestionRequest;
import com.resengkor.management.domain.qna.dto.response.AnswerResponse;
import com.resengkor.management.domain.qna.dto.response.QuestionResponse;
import com.resengkor.management.domain.qna.entity.Answer;
import com.resengkor.management.domain.qna.entity.Question;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class QnaMapper {

    // QuestionRequest -> Question Entity
    public Question toQuestionEntity(QuestionRequest questionRequest, User user) {
        return Question.builder()
                .title(questionRequest.getTitle())
                .content(questionRequest.getContent())
                .isSecret(questionRequest.isSecret())
                .password(questionRequest.getPassword())
                .user(user)
                .build();
    }

    // Question Entity -> QuestionResponse
    public QuestionResponse toQuestionResponse(Question question) {
        return QuestionResponse.builder()
                .title(question.getTitle())
                .content(question.getContent())
                .isSecret(question.isSecret())
                .password(question.getPassword())
                .viewCount(question.getViewCount())
                .user(question.getUser())
                .build();
    }

    // Answer Request to Entity
    public Answer toAnswerEntity(AnswerRequest request, Question question, User admin) {
        return Answer.builder()
                .content(request.getContent())
                .question(question)
                .admin(admin)
                .build();
    }

    // Answer Entity to Response
    public AnswerResponse toAnswerResponse(Answer answer) {
        return AnswerResponse.builder()
                .id(answer.getId())
                .content(answer.getContent())
                .questionId(answer.getQuestion().getId())
                .adminId(answer.getAdmin().getId())
                .build();
    }
}
