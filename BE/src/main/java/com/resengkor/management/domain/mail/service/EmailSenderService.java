package com.resengkor.management.domain.mail.service;


import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSenderService {
    private final JavaMailSender javaMailSender;

    @Async("emailAsyncExecutor")  // 비동기 메소드
    public void sendDetailMail(MimeMessage message) {
        long startTime = System.currentTimeMillis(); // 메일 발송 시작 시간 기록
        try {
            javaMailSender.send(message); // 메일 발송
        } catch (MailException e) {
            e.printStackTrace();
            throw new CustomException(ExceptionStatus.EMAIL_SEND_FAIL);
        }
        long endTime = System.currentTimeMillis(); // 메일 발송 완료 시간 기록
        long duration = endTime - startTime; // 시간 차이 계산

        log.info("메일 발송 시간: {} ms", duration); // 발송 시간 로그로 출력
    }
}
