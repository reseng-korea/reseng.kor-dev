package com.resengkor.management.global.exception;


import com.resengkor.management.global.response.CommonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class ControllerAdvisor {

    @ExceptionHandler(CustomException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse customExceptionHandler(CustomException e){
        CommonResponse response = new CommonResponse();

        response.setCode(e.getExceptionStatus().getCode());
        response.setMessage(e.getExceptionStatus().getMessage());

        return response;
    }

    /* 어디에서도 잡지 못한 예외 핸들링 */
    @ExceptionHandler(Exception.class)
    public CommonResponse exceptionHandler(Exception e) {
        CommonResponse response = new CommonResponse();

        response.setCode(ExceptionStatus.EXCEPTION.getCode());
        response.setMessage(ExceptionStatus.EXCEPTION.getMessage());

        return response;
    }

}
