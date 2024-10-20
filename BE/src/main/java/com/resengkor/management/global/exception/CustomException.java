package com.resengkor.management.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException{

    final ExceptionStatus exceptionStatus;
}
