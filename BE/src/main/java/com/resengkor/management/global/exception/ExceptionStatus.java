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
    EXCEPTION(-9999, "예외가 발생하였습니다."),

    /* 토큰 관련 오류 */
    ACCESS_TOKEN_EXPIRED(1000, "토큰이 만료되었습니다. 다시 로그인해 주세요."),
    REFRESH_TOKEN_EXPIRED(1001, "리프레쉬 토큰이 만료되었습니다. 다시 로그인해 주세요."),
    TOKEN_NOT_FOUND_IN_COOKIE(1002, "토큰이 쿠키에 없습니다. 다시 시도해 주세요."),
    TOKEN_NOT_FOUND_IN_HEADER(1003, "토큰이 헤더에 없습니다. 인증이 필요합니다."),
    TOKEN_NOT_FOUND_IN_DB(1004, "토큰이 DB에 존재하지 않습니다. 다시 로그인해 주세요."),
    TOKEN_PARSE_ERROR(1005, "JWT 토큰 파싱에 실패하였습니다. 유효한 토큰을 사용해 주세요."),

    // 4xx 클라이언트 오류
    /* 유효성 검사 오류 */
    VALIDATION_ERROR(4000, "요청 데이터의 유효성 검사가 실패했습니다."),
    /* HTTP 메서드 오류 */
    METHOD_NOT_ALLOWED(4001, "지원되지 않는 HTTP 메서드 요청입니다. 요청 방식을 확인해 주세요."),

    /* 인증 및 권한 오류 */
    AUTHENTICATION_FAILED(4010, "유저 인증에 실패하였습니다."),
    ACCESS_DENIED(4011, "접근이 거부되었습니다. 필요한 권한이 없습니다."),
    INVALID_CREDENTIALS(4012, "잘못된 자격 증명입니다. 아이디와 비밀번호를 다시 확인해 주세요."),

    /* 사용자 관련 오류 */
    USER_NOT_FOUND(4020, "존재하지 않는 사용자입니다. 회원가입 여부를 확인해 주세요."),
    USER_ALREADY_EXIST(4021, "이미 존재하는 사용자입니다. 다른 정보를 입력해 주세요."),
    USER_EMAIL_ALREADY_EXIST(4022, "이미 존재하는 이메일입니다. 다른 이메일을 사용해 주세요."),
    USER_PHONE_NUMBER_ALREADY_EXIST(4023, "이미 존재하는 전화번호입니다. 다른 번호를 사용해 주세요."),
    ACCOUNT_DISABLED(4024, "계정이 비활성화되었습니다. 관리자에게 문의하세요."),
    USER_PROFILE_NOT_FOUND(4025, "사용자의 상세 정보가 존재하지 않습니다."),
    INVALID_PASSWORD(4026, "비밀번호가 불일치합니다. 다시 입력해 주세요."),

    /* 이메일 및 인증 코드 오류 */
    EMAIL_NOT_FOUND(4030, "존재하지 않는 이메일입니다. 이메일 주소를 확인해 주세요."),
    CODE_MISMATCH(4031, "인증 코드가 일치하지 않습니다. 올바른 코드를 입력해 주세요."),
    CODE_EXPIRED(4032, "인증 코드가 존재하지 않습니다. 새 코드를 요청해 주세요."),


    // 5xx 서버 오류
    EMAIL_SEND_FAIL(5001, "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    SMS_SEND_FAIL(5002, "SMS 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    DATA_NOT_FOUND(5003, "서버에서 데이터를 찾을 수 없습니다. 요청을 다시 확인해 주세요."),
    DB_CONNECTION_ERROR(5004, "데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    S3_CONNECTION_ERROR(5005, "s3 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."),
    FILE_CONVERSION_ERROR(5006, "MultipartFile을 로컬 파일로 변환할 수 없습니다."),

    // 6xx 등급 관련 오류
    ROLE_CHANGE_FAIL(6001, "해당 유저의 등급을 변경할 권리가 없습니다."),
    ROLE_PERMISSION_DENIED(6002, "해당 등급 변경에 필요한 권한이 부족합니다."),


    FORBIDDEN_FAILED(4001, "콘텐츠에 접근할 수 없어, 정보를 조회할 수 없습니다."),
    MEMBER_NOT_FOUND(4012, "존재하지 않는 사용자입니다.");

    private final int code;
    private final String message;
}
