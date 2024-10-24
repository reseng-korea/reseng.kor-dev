package com.resengkor.management.domain.mail.controller;

import com.resengkor.management.domain.mail.dto.MailAuthDTO;
import com.resengkor.management.domain.mail.dto.MailDTO;
import com.resengkor.management.domain.mail.service.MailService;
import com.resengkor.management.global.response.CommonResponse;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mail")
public class MailController {

    private final MailService mailService;

    @PostMapping("/send-verification")
    public CommonResponse sendEmail(@RequestBody MailDTO mailDTO) throws MessagingException, UnsupportedEncodingException {
        return mailService.sendMail(mailDTO.getEmail()); // Response body에 값을 반환
    }

    @GetMapping("/verify")
    public CommonResponse checkEmail(@RequestBody MailAuthDTO mailAuthDTO) throws MessagingException, UnsupportedEncodingException {
        return mailService.emailAuthentication(mailAuthDTO); // Response body에 값을 반환
    }
}
