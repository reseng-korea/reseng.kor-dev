package com.resengkor.management.domain.qna.controller;


import com.resengkor.management.domain.qna.dto.request.AnswerRequest;
import com.resengkor.management.domain.qna.dto.request.QuestionRequest;
import com.resengkor.management.domain.qna.dto.response.AnswerResponse;
import com.resengkor.management.domain.qna.dto.response.QuestionResponse;
import com.resengkor.management.domain.qna.service.QnaService;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/qna")
@RequiredArgsConstructor
@Slf4j
public class QnaController {
    private final QnaService qnaService;

    // 질문 생성 (GUEST 이상 가능)
    @PostMapping("/questions")
    @PreAuthorize("hasRole('ROLE_GUEST')")
    public DataResponse<QuestionResponse> createQuestion(@Valid @RequestBody QuestionRequest questionRequest, BindingResult bindingResult) {
        log.info("---------Controller : createQuestion method start---------");
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = qnaService.validateHandling(bindingResult);
            log.info("바인딩 에러 = {}",validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        return qnaService.createQuestion(questionRequest);
    }

    // 질문 수정 (작성자만 가능)
    @PutMapping("/questions/{questionId}")
    public DataResponse<QuestionResponse> updateQuestion(@PathVariable Long questionId, @Valid @RequestBody QuestionRequest questionDTO, BindingResult bindingResult) {
        log.info("---------Controller : updateQuestion method start---------");
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = qnaService.validateHandling(bindingResult);
            log.info("바인딩 에러 = {}",validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        return qnaService.updateQuestion(questionId, questionDTO);
    }

    // 질문 삭제 (작성자만 가능)
    @DeleteMapping("/questions/{questionId}")
    public DataResponse<Void> deleteQuestion(@PathVariable Long questionId) {
        log.info("---------Controller : deleteQuestion method start---------");
        return qnaService.deleteQuestion(questionId);
    }

    // 질문 목록 조회 (모두 가능)
    @GetMapping("/questions")
    public DataResponse<Page<QuestionResponse>> getAllQuestions(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {
        log.info("---------Controller : getAllQuestions method start---------");
        return qnaService.getAllQuestions(page, size);
    }

    // 질문 상세 조회 (작성자와 관리자만 비밀글 조회 가능)
    @GetMapping("/questions/{questionId}")
    public DataResponse<QuestionResponse> getQuestionDetails(@PathVariable Long questionId,
                                                             @RequestParam Long userId,
                                                             @RequestParam(required = false) String password) {
        log.info("---------Controller : getQuestionDetails method start---------");
        return qnaService.getQuestionDetails(questionId, userId, password);
    }

    // 답변 생성 (관리자만 가능)
    @PostMapping("/answers")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public DataResponse<AnswerResponse> createAnswer(@Valid @RequestBody AnswerRequest answerRequest, BindingResult bindingResult) {
        log.info("---------Controller : createAnswer method start---------");
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = qnaService.validateHandling(bindingResult);
            log.info("바인딩 에러 = {}",validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        return qnaService.createAnswer(answerRequest);
    }

    // 답변 수정 (관리자만 가능)
    @PutMapping("/answers/{answerId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public DataResponse<AnswerResponse> updateAnswer(@PathVariable Long answerId, @Valid @RequestBody AnswerRequest answerRequest, BindingResult bindingResult) {
        log.info("---------Controller : updateAnswer method start---------");
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = qnaService.validateHandling(bindingResult);
            log.info("바인딩 에러 = {}",validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        return qnaService.updateAnswer(answerId, answerRequest);
    }

    // 답변 삭제 (관리자만 가능)
    @DeleteMapping("/answers/{answerId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public DataResponse<Void> deleteAnswer(@PathVariable Long answerId) {
        log.info("---------Controller : deleteAnswer method start---------");
        return  qnaService.deleteAnswer(answerId);
    }



}
