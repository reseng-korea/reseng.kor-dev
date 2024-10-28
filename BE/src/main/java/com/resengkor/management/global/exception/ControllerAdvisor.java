package com.resengkor.management.global.exception;


import com.resengkor.management.global.response.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
@Slf4j
public class ControllerAdvisor {

    @ExceptionHandler(CustomException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse customExceptionHandler(CustomException e){
        CommonResponse response = new CommonResponse();

        response.setCode(e.getExceptionStatus().getCode());
        response.setMessage(e.getExceptionStatus().getMessage());

        return response;
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public CommonResponse handleAuthenticationException(AuthenticationException ex) {
        return new CommonResponse(HttpStatus.UNAUTHORIZED.value(), "인증이 필요합니다.");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public CommonResponse handleAccessDeniedException(AccessDeniedException ex) {
        return new CommonResponse(HttpStatus.FORBIDDEN.value(), "접근 권한이 없습니다.");
    }



    /* 어디에서도 잡지 못한 예외 핸들링 */
    @ExceptionHandler(Exception.class)
    public CommonResponse exceptionHandler(Exception e) {
        log.error("Unhandled Exception: ", e); // 예외 로그
        CommonResponse response = new CommonResponse();

        response.setCode(ExceptionStatus.EXCEPTION.getCode());
        response.setMessage(ExceptionStatus.EXCEPTION.getMessage());

        return response;
    }

}
