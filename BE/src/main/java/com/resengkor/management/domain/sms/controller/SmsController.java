package com.resengkor.management.domain.sms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.resengkor.management.domain.mail.dto.MailAuthDTO;
import com.resengkor.management.domain.sms.dto.MessageAuthDTO;
import com.resengkor.management.domain.sms.dto.MessageDto;
import com.resengkor.management.domain.sms.dto.SmsResponse;
import com.resengkor.management.domain.sms.service.SmsServiceWithRedis;
import com.resengkor.management.global.response.CommonResponse;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/sms")
@Slf4j
public class SmsController {
    private final SmsServiceWithRedis smsService;

    @PostMapping("/send-verification")
    public SmsResponse sendSms(@RequestBody MessageDto messageDto) throws UnsupportedEncodingException, URISyntaxException, NoSuchAlgorithmException, InvalidKeyException, JsonProcessingException {
        log.info("------------------------------------------------");
        log.info("enter sendSms");
        log.info("------------------------------------------------");
        return smsService.sendSms(messageDto,"verifyPhoneNumber");
    }

    @PostMapping("/verify")
    public CommonResponse checkSms(@RequestBody MessageAuthDTO messageAuthDTO) {
        log.info("------------------------------------------------");
        log.info("enter checkSms");
        log.info("------------------------------------------------");
        return smsService.smsAuthentication(messageAuthDTO); // Response body에 값을 반환
    }
}
