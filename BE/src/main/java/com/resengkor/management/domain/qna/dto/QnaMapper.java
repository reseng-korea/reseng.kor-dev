package com.resengkor.management.domain.qna.dto;

import com.resengkor.management.domain.qna.dto.request.AnswerRequest;
import com.resengkor.management.domain.qna.dto.request.QuestionRequest;
import com.resengkor.management.domain.qna.dto.response.AnswerResponse;
import com.resengkor.management.domain.qna.dto.response.QuestionAnswerResponse;
import com.resengkor.management.domain.qna.dto.response.QuestionDetailResponse;
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
                .questionId(question.getId())
                .title(question.getTitle())
                .isSecret(question.isSecret())
                .viewCount(question.getViewCount())
                .userId(question.getUser().getId())
                .representativeName(question.getUser().getRepresentativeName())
                .isAnswered(question.isAnswered())
                .createdAt(question.getCreatedAt())
                .build();
    }

    public QuestionDetailResponse toQuestionDetailResponse(Question question) {
        return QuestionDetailResponse.builder()
                .questionId(question.getId())
                .title(question.getTitle())
                .content(question.getContent())
                .isSecret(question.isSecret())
                .password(question.getPassword())
                .viewCount(question.getViewCount())
                .userId(question.getUser().getId())
                .isAnswered(question.isAnswered())
                .representativeName(question.getUser().getRepresentativeName())
                .createdAt(question.getCreatedAt())
                .build();
    }

    public QuestionAnswerResponse toQuestionAnswerResponse(Question question) {
        AnswerResponse answerResponse = null;
        if (question.getAnswer() != null) {
            answerResponse = toAnswerResponse(question.getAnswer());
        }

        return QuestionAnswerResponse.builder()
                .questionId(question.getId())
                .title(question.getTitle())
                .content(question.getContent())
                .isSecret(question.isSecret())
                .password(question.getPassword())
                .viewCount(question.getViewCount())
                .userId(question.getUser().getId())
                .representativeName(question.getUser().getRepresentativeName())
                .createdAt(question.getCreatedAt())
                .isAnswered(question.isAnswered())
                .answer(answerResponse)
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
                .answerId(answer.getId())
                .content(answer.getContent())
                .questionId(answer.getQuestion().getId())
                .adminId(answer.getAdmin().getId())
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .build();
    }
}
