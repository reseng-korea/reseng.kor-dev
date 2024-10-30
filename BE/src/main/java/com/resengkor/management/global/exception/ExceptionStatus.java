package com.resengkor.management.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExceptionStatus {

    /**
     * code : 예외 코드 (4자리, 맨앞자리는 HTTP 상태코드를 따라감)
     * message : 예외 메시지
     */
    //4xx 클라이언트 오류, 5xx 서버 오류

    /* 예시 */
    EXCEPTION(-9999, "예외가 발생하였습니다."),

    /* 토큰 */
    TOKEN_EXPIRED(-1000, "토큰이 만료되었습니다."),
    REFRESH_TOKEN_EXPIRED(-1001, "리프레쉬토큰이 만료되었습니다."),
    TOKEN_NOT_FOUND_IN_COOKIE(-1002, "토큰이 쿠키에 없습니다."),
    TOKEN_NOT_FOUND_IN_HEADER(-1003, "토큰이 헤더에 없습니다."),
    TOKEN_NOT_FOUND(-1004, "토큰이 DB에 존재하지 않습니다."),
    TOKEN_PARSE_ERROR(-1005, "JWT 토큰 파싱에 실패하였습니다."),

    AUTHENTICATION_FAILED(4000, "유저 인증에 실패하였습니다."),
    FORBIDDEN_FAILED(4001, "콘텐츠에 접근할 수 없어, 정보를 조회할 수 없습니다."),

    MEMBER_ALREADY_EXIST(4010, "이미 존재하는 사용자입니다."),
    MEMBER_EMAIL_ALREADY_EXIST(4011, "이미 존재하는 이메일입니다."),
    MEMBER_PHONE_NUMBER_ALREADY_EXIST(4012, "이미 존재하는 전화번호입니다."),
    MEMBER_INACTIVE(4013,"비활성화된 사용자입니다."),
    MEMBER_NOT_FOUND(4012, "존재하지 않는 사용자입니다."),
    MEMBER_PROFILE_NOT_FOUND(4013, "사용자의 상세정보가 존재하지 않습니다."),
    VALIDATION_ERROR(4014, "Validation Error"),

    /* 이메일 */
    EMAIL_NOT_FOUND(4021, "존재하지 않는 이메일입니다."),
    CODE_MISMATCH(4022, "이메일 인증 코드가 일치하지 않습니다."),
    CODE_EXPIRED(4023, "인증 코드가 만료되었습니다."),
    EMAIL_FAILED(5001,"메일 발송 중 오류가 발생했습니다."),

    /* SMS */
    SMS_SEND_FAIL(5002,"sms 발송 중 오류가 발생했습니다."),

    DATA_NOT_FOUND(5000, "데이터가 존재하지 않습니다.");


    private final int code;
    private final String message;
}
