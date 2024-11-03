package com.resengkor.management.domain.qna.service;



import com.resengkor.management.domain.qna.dto.QnaMapper;
import com.resengkor.management.domain.qna.dto.request.AnswerRequest;
import com.resengkor.management.domain.qna.dto.request.QuestionRequest;
import com.resengkor.management.domain.qna.dto.response.AnswerResponse;
import com.resengkor.management.domain.qna.dto.response.QuestionResponse;
import com.resengkor.management.domain.qna.entity.Answer;
import com.resengkor.management.domain.qna.entity.Question;
import com.resengkor.management.domain.qna.repository.AnswerRepository;
import com.resengkor.management.domain.qna.repository.QuestionRepository;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnaService {
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final QnaMapper qnaMapper;

    //현재 로그인한 사용자 ID 가져와서 User 객체 가져오기
    private User getCurrentLoginUser() {
        Long userId = UserAuthorizationUtil.getLoginMemberId(); // 로그인한 사용자 ID 가져오기
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
    }

    //로그인한 user와 Question의 user가 같은지 확인
    private void validateUserPermission(User questionUser) {
        User currentUser = getCurrentLoginUser();
        if (!currentUser.getId().equals(questionUser.getId())) {
            log.info("---------Service ERROR: 로그인한 사람과 질문의 작성자가 다름---------");
            throw new CustomException(ExceptionStatus.ACCESS_DENIED);
        }
    }

    //관리자인지 아닌지
    private boolean isAdmin(User user) {
        return user.getRole().getRole().equals("ROLE_MANAGER");
    }

    //valid 검사
    public Map<String, String> validateHandling(BindingResult bindingResult) {
        Map<String, String> validatorResult = new HashMap<>();

        for(FieldError error : bindingResult.getFieldErrors()) {
            String validKeyName = String.format("valid_%s", error.getField());
            validatorResult.put(validKeyName, error.getDefaultMessage());
        }

        return validatorResult;
    }

    // 질문 생성
    @Transactional
    public DataResponse<QuestionResponse> createQuestion(QuestionRequest questionRequest) {
        log.info("---------Service : createQuestion method start---------");
        // 1. 로그인한 사용자 가져오기
        User loginUser = getCurrentLoginUser();
        // 2. 요청 객체를 Question 엔티티로 변환
        Question question = qnaMapper.toQuestionEntity(questionRequest, loginUser);
        // 3. 변환된 Question 엔티티를 데이터베이스에 저장
        questionRepository.save(question);
        // 4. 저장된 Question 엔티티를 QuestionResponse DTO로 변환
        QuestionResponse questionResponse = qnaMapper.toQuestionResponse(question);

        return new DataResponse<>(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage(),
                questionResponse);

    }

    //질문 수정
    @Transactional
    public DataResponse<QuestionResponse> updateQuestion(Long questionId, QuestionRequest questionRequest) {
        log.info("---------Service : updateQuestion method start---------");
        // 1. 주어진 ID로 질문 엔티티 조회
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        log.info("---------Service : 질문 잘 찾음---------");
        // 2. 질문 작성자와 현재 로그인한 사용자가 동일한지 검증
        validateUserPermission(question.getUser());
        // 3. 요청 데이터를 기반으로 질문 정보 업데이트
        question.updateQuestion(questionRequest.getTitle(),
                questionRequest.getContent(),
                questionRequest.isSecret(),
                questionRequest.getPassword());
        // 4. 변경된 질문 엔티티를 데이터베이스에 저장
        questionRepository.save(question);
        // 5. 수정된 질문 엔티티를 QuestionResponse DTO로 변환
        QuestionResponse questionResponse = qnaMapper.toQuestionResponse(question);
        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(), ResponseStatus.UPDATED_SUCCESS.getMessage(), questionResponse);
    }

    //질문 삭제
    @Transactional
    public DataResponse<Void> deleteQuestion(Long questionId) {
        log.info("---------Service : deleteQuestion method start---------");
        // 1. 주어진 ID로 질문 엔티티 조회
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        // 2. 질문 작성자와 현재 로그인한 사용자가 동일한지 검증
        validateUserPermission(question.getUser());
        // 3. 질문 엔티티를 데이터베이스에서 삭제
        questionRepository.delete(question);
        return new DataResponse<>(ResponseStatus.DELETED_SUCCESS.getCode(), ResponseStatus.DELETED_SUCCESS.getMessage(), null);
    }


    //질문 목록 조회
    public DataResponse<Page<QuestionResponse>> getAllQuestions(int page, int size) {
        log.info("---------Service : getAllQuestions method start---------");
        // 1. 페이지 요청 객체 생성
        PageRequest pageRequest = PageRequest.of(page, size);
        // 2. 모든 질문을 페이지 단위로 조회
        Page<Question> questions = questionRepository.findAll(pageRequest);
        // 3. 조회된 질문 목록을 QuestionResponse DTO로 변환
        Page<QuestionResponse> questionResponses = questions.map(qnaMapper::toQuestionResponse);
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), questionResponses);
    }


    //질문 상세 조회
    public DataResponse<QuestionResponse> getQuestionDetails(Long questionId, Long userId, String password) {
        log.info("---------Service : getQuestionDetails method start---------");
        // 1. 주어진 ID로 질문 엔티티 조회
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 2. 현재 로그인한 사용자 정보 가져오기
        User currentUser = getCurrentLoginUser();

        // 3. 비밀글일 경우, 작성자나 관리자가 아닌 경우 비밀번호 검증
        if (question.isSecret() && !question.getUser().getId().equals(userId)) {
            if (password == null || !question.getPassword().equals(password)) {
                throw new CustomException(ExceptionStatus.INVALID_PASSWORD);
            }
        }

        // 4. 조회수 증가
        question.incrementViewCount();
        // 5. Question 엔티티를 QuestionResponse DTO로 변환
        QuestionResponse questionResponse = qnaMapper.toQuestionResponse(question);

        // 6. 관리자인 경우 비밀글 접근 허용
        if (currentUser.getRole().equals(Role.ROLE_MANAGER)) {
            return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                    ResponseStatus.RESPONSE_SUCCESS.getMessage(),
                    questionResponse);
        }

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(),
                questionResponse);
    }

    //답변 생성
    @Transactional
    public DataResponse<AnswerResponse> createAnswer(AnswerRequest answerRequest) {
        log.info("---------Service : createAnswer method start---------");
        // 1. 주어진 질문 ID로 질문 엔티티 조회
        Question question = questionRepository.findById(answerRequest.getQuestionId())
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 2. 현재 로그인한 사용자 가져오기
        User admin = getCurrentLoginUser();
        // 3. 관리자인지 확인
        if (!isAdmin(admin)) {
            throw new CustomException(ExceptionStatus.ACCESS_DENIED);
        }
        // 4. AnswerRequest DTO를 Answer 엔티티로 변환
        Answer answer = qnaMapper.toAnswerEntity(answerRequest, question, admin);
        // 5. 변환된 Answer 엔티티를 데이터베이스에 저장
        answerRepository.save(answer);

        return new DataResponse<>(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage(), qnaMapper.toAnswerResponse(answer));
    }

    //답변 수정
    @Transactional
    public DataResponse<AnswerResponse> updateAnswer(Long answerId, AnswerRequest answerRequest) {
        log.info("---------Service : updateAnswer method start---------");
        // 1. 주어진 ID로 답변 엔티티 조회
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 2. 현재 로그인한 사용자 가져오기
        User admin = getCurrentLoginUser();
        // 3. 관리자인지 확인
        if (!isAdmin(admin)) {
            throw new CustomException(ExceptionStatus.ACCESS_DENIED);
        }

        // 4. 답변 내용 수정
        answer.updateContent(answerRequest.getContent());
        // 5. 수정된 Answer 엔티티를 데이터베이스에 저장
        answerRepository.save(answer);

        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), qnaMapper.toAnswerResponse(answer));
    }


    //답변 삭제
    @Transactional
    public DataResponse<Void> deleteAnswer(Long answerId) {
        log.info("---------Service : deleteAnswer method start---------");
        // 1. 주어진 ID로 답변 엔티티 조회
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 2. 현재 로그인한 사용자 가져오기
        User admin = getCurrentLoginUser();
        // 3. 관리자인지 확인
        if (!isAdmin(admin)) {
            throw new CustomException(ExceptionStatus.ACCESS_DENIED);
        }

        // 4. 답변 엔티티 삭제
        answerRepository.delete(answer);
        return new DataResponse<>(ResponseStatus.DELETED_SUCCESS.getCode(),
                ResponseStatus.DELETED_SUCCESS.getMessage(), null);
    }




}
