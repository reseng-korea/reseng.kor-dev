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
            throw new CustomException(ExceptionStatus.EMAIL_SEND_FAIL);
        }

        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage());
    }

    //메일 생성
    public MimeMessage createMail(String mail, String number) throws MessagingException, UnsupportedEncodingException  {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(new InternetAddress(address, personal));
        message.setRecipients(MimeMessage.RecipientType.TO, mail); //받는 사람
        message.setSubject("[(주)리앤생] 이메일 인증번호 입니다)");
        String body = "";
        body = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;'>"
                + "<h2 style='color: #61A24E;'>이메일 인증</h2>"
                + "<p>안녕하세요? <strong>(주)리앤생</strong> 입니다.</p>"
                + "<p>아래 인증번호를 입력하여 이메일 인증을 해주세요.</p>"
                + "<div style='text-align: center; margin-top: 20px;'>"
                + "    <span style='font-size: 18px; color: #ffffff; background-color: #61A24E; padding: 10px 20px; border-radius: 5px;'>"
                + "        인증번호: " + number + "</span>"
                + "</div>"
                + "<div style='margin-top: 30px; text-align: center;'>"
                + "    <p style='color: #666666;'>감사합니다.</p>"
                + "</div>"
                + "</div>";

        message.setText(body, "UTF-8", "html");

        return message;
    }

    // 이메일 및 인증 코드를 RDS에 저장
    private void saveVerificationCode(String email, String verificationCode) {
//        redisUtil.setData("email:verification:" + email, verificationCode, 5, TimeUnit.MINUTES); // 5분 유효
    }


    //이메일 인증
    @Transactional
    public CommonResponse checkEmail(MailAuthDTO dto) {
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

