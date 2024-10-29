package com.resengkor.management.domain.mail.service;

import com.resengkor.management.domain.mail.dto.MailAuthDTO;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.util.RedisUtil;
import com.resengkor.management.global.util.TmpCodeUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceWithRedis {
    @Value("${spring.mail.address}") //"인증코드를 발송하는 이메일 주소"
    private String address;
    @Value("${spring.mail.personal}") //"인증코드를 발송하는 송신인명"
    private String personal;

    private final JavaMailSender javaMailSender;
    //    private final MailRepository emailVerificationRepository;
    private final RedisUtil redisUtil; // RedisUtil 주입

    // 메일 발송
    @Transactional
    public CommonResponse sendMail(String sendEmail) throws MessagingException, UnsupportedEncodingException {
        log.info("enter send-verification service");
        //1. 랜덤 인증번호 생성
        String number = TmpCodeUtil.generateAlphanumericPassword();

        //2. rds에 이메일+인증코드 저장
        saveVerificationCode(sendEmail, number);

        //3. 메일 생성
        MimeMessage message = createMail(sendEmail, number);
        try {
            javaMailSender.send(message); // 메일 발송
        } catch (MailException e) {
            e.printStackTrace();
            throw new CustomException(ExceptionStatus.EMAIL_FAILED);
        }

        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage());
    }

    //메일 생성
    public MimeMessage createMail(String mail, String number) throws MessagingException, UnsupportedEncodingException  {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(new InternetAddress(address, personal));
        message.setRecipients(MimeMessage.RecipientType.TO, mail); //받는 사람
        message.setSubject("이메일 인증");
        String body = "";
        body += "<h3>요청하신 인증 번호입니다.</h3>";
        body += "<h1>" + number + "</h1>";
        body += "<h3>감사합니다.</h3>";
        message.setText(body, "UTF-8", "html");

        return message;
    }

    // 이메일 및 인증 코드를 RDS에 저장
    private void saveVerificationCode(String email, String verificationCode) {
        redisUtil.setData("email:verification:" + email, verificationCode, 5, TimeUnit.MINUTES); // 5분 유효
    }


    //이메일 인증
    @Transactional
    public CommonResponse emailAuthentication(MailAuthDTO dto) {
        // Redis에서 인증 코드 조회
        String storedCode = redisUtil.getData("email:verification:" + dto.getEmail());
        if (storedCode == null) {
            throw new CustomException(ExceptionStatus.EMAIL_NOT_FOUND); // 인증 코드가 존재하지 않는 경우
        }

        // 인증 코드 확인
        if (!storedCode.equals(dto.getCode())) {
            throw new CustomException(ExceptionStatus.CODE_MISMATCH); // 인증 코드가 일치하지 않는 경우 예외 발생
        }

        // 인증 성공 시 처리 로직
        redisUtil.deleteData("email:verification:" + dto.getEmail());

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage());
    }
}

