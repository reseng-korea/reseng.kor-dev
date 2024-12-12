package com.resengkor.management.domain.mail.service;

import com.resengkor.management.domain.mail.dto.MailAuthDTO;
import com.resengkor.management.domain.mail.dto.MailDTO;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.util.RedisUtil;
import com.resengkor.management.global.util.TmpCodeUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceWithRedis {
    @Value("${spring.mail.address}") //"인증코드를 발송하는 이메일 주소"
    private String address;
    @Value("${spring.mail.personal}") //"인증코드를 발송하는 송신인명"
    private String personal;

    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;
    private final RedisUtil redisUtil; // RedisUtil 주입
    private final EmailSenderService emailSenderService;  // 비동기 메소드를 호출하는 별도 서비스

    //메세지 발송
    public CommonResponse sendMail(MailDTO mailDTO) throws MessagingException, UnsupportedEncodingException {
        long startTime = System.currentTimeMillis(); // 메일 발송 시작 시간 기록

        //핸드폰 인증(만약 이미 존재하는 핸드폰이라면)
        String sendEmail = mailDTO.getEmail();

        if (!sendEmail.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            log.info("이메일 유효한지 체크");
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        Optional<User> existingUserByPhoneNumber = userRepository.findByEmail(sendEmail);
        if (existingUserByPhoneNumber.isPresent()) {
            User user = existingUserByPhoneNumber.get();
            if (!user.isStatus()) {
                log.info("비활성 사용자입니다.");
                throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED); // 비활성 사용자 예외
            }
            log.info("이미 존재하는 사용자입니다.");
            throw new CustomException(ExceptionStatus.USER_EMAIL_ALREADY_EXIST); // 이미 존재하는 이메일 예외
        }

        //1. 랜덤 인증번호 생성
        String number = TmpCodeUtil.generateAlphanumericPassword();

        //2. rds에 이메일+인증코드 저장
        saveVerificationCode(sendEmail, number);

        //3. 메일 생성
        MimeMessage message = createMail(sendEmail, number);

        log.info("이메일 사용 가능: " + mailDTO.getEmail());
        long endTime = System.currentTimeMillis(); // 메일 발송 완료 시간 기록
        long duration = endTime - startTime; // 시간 차이 계산

        log.info("메일 발송 전 로직 : {} ms", duration); // 발송 시간 로그로 출력
        emailSenderService.sendDetailMail(message);
        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(), ResponseStatus.CREATED_SUCCESS.getMessage());
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

    // 이메일 및 인증 코드를 redis에 저장
    public void saveVerificationCode(String email, String verificationCode) {
        redisUtil.setData("email:verification:" + email, verificationCode, 5, TimeUnit.MINUTES); // 5분 유효
    }

//    // 메일 발송
//    @Async("emailAsyncExecutor")
//    public CommonResponse sendDetailMail(MimeMessage message) {
//        long startTime = System.currentTimeMillis(); // 메일 발송 시작 시간 기록
//        try {
//            javaMailSender.send(message); // 메일 발송
//        } catch (MailException e) {
//            e.printStackTrace();
//            throw new CustomException(ExceptionStatus.EMAIL_SEND_FAIL);
//        }
//        long endTime = System.currentTimeMillis(); // 메일 발송 완료 시간 기록
//        long duration = endTime - startTime; // 시간 차이 계산
//
//        log.info("메일 발송 시간: {} ms", duration); // 발송 시간 로그로 출력
//
//        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(),
//                ResponseStatus.CREATED_SUCCESS.getMessage());
//    }

    //이메일 인증
    public CommonResponse checkEmail(MailAuthDTO dto) {
        // Redis에서 인증 코드 조회
        String storedCode = redisUtil.getData("email:verification:" + dto.getEmail());
        if (storedCode == null) {
            throw new CustomException(ExceptionStatus.CODE_EXPIRED); // 인증 코드가 존재하지 않는 경우
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

