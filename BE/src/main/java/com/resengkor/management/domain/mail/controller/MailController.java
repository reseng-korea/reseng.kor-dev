package com.resengkor.management.domain.mail.controller;

import com.resengkor.management.domain.mail.dto.MailAuthDTO;
import com.resengkor.management.domain.mail.dto.MailDTO;
import com.resengkor.management.domain.mail.service.MailServiceWithRedis;
import com.resengkor.management.global.response.CommonResponse;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mail")
@Slf4j
public class MailController {

    private final MailServiceWithRedis mailService;

    @PostMapping("/send-verification")
    public CommonResponse sendEmail(@RequestBody MailDTO mailDTO) throws MessagingException, UnsupportedEncodingException {
        log.info("enter send-verification controller");
        return mailService.sendMail(mailDTO); // Response body에 값을 반환
    }

    @PostMapping("/verify")
    public CommonResponse checkEmail(@RequestBody MailAuthDTO mailAuthDTO) throws MessagingException, UnsupportedEncodingException {
        return mailService.checkEmail(mailAuthDTO); // Response body에 값을 반환
    }
}
