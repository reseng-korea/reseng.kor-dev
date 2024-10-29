package com.resengkor.management.domain.sms.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.domain.sms.dto.MessageAuthDTO;
import com.resengkor.management.domain.sms.dto.MessageDto;
import com.resengkor.management.domain.sms.dto.SmsRequest;
import com.resengkor.management.domain.sms.dto.SmsResponse;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Configuration
@Slf4j
@RequiredArgsConstructor
@Service
public class SmsServiceWithRedis {
    //휴대폰 인증 번호
    private final String smsConfirmNum = createSmsKey();
    private final RedisUtil redisUtil;

    @Value("${spring.naver-cloud-sms.accessKey}")
    private String accessKey;

    @Value("${spring.naver-cloud-sms.secretKey}")
    private String secretKey;

    @Value("${spring.naver-cloud-sms.serviceId}")
    private String serviceId;

    @Value("${spring.naver-cloud-sms.senderPhone}")
    private String phone;

    public String getSignature(String time) throws NoSuchAlgorithmException, UnsupportedEncodingException, InvalidKeyException {
        String space = " ";
        String newLine = "\n";
        String method = "POST";
        String url = "/sms/v2/services/"+ this.serviceId+"/messages";
        String accessKey = this.accessKey;
        String secretKey = this.secretKey;

        String message = new StringBuilder()
                .append(method)
                .append(space)
                .append(url)
                .append(newLine)
                .append(time)
                .append(newLine)
                .append(accessKey)
                .toString();

        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);

        byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
        String encodeBase64String = Base64.encodeBase64String(rawHmac);

        return encodeBase64String;
    }

    // 인증코드 만들기
    public static String createSmsKey() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 5; i++) { // 인증코드 5자리
            key.append((rnd.nextInt(10)));
        }
        return key.toString();
    }

    //메세지 발송
    @Transactional
    public SmsResponse sendSms(MessageDto messageDto) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
        log.info("------------------------------------------------");
        log.info("service sendSms enter");
        log.info("------------------------------------------------");
        String time = Long.toString(System.currentTimeMillis());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-ncp-apigw-timestamp", time);
        headers.set("x-ncp-iam-access-key", accessKey);
        headers.set("x-ncp-apigw-signature-v2", getSignature(time)); // signature 서명

        List<MessageDto> messages = new ArrayList<>();
        messages.add(messageDto);

        SmsRequest request = SmsRequest.builder()
                .type("SMS")
                .contentType("COMM")
                .countryCode("82")
                .from(phone)
                .content("[서비스명 테스트닷] 인증번호 [" + smsConfirmNum + "]를 입력해주세요")
                .messages(messages)
                .build();

        //쌓은 바디를 json형태로 반환
        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(request);
        // jsonBody와 헤더 조립
        HttpEntity<String> httpBody = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        //restTemplate로 post 요청 보내고 오류가 없으면 202코드 반환
        SmsResponse smsResponseDto = restTemplate.postForObject(new URI("https://sens.apigw.ntruss.com/sms/v2/services/"+ serviceId +"/messages"), httpBody, SmsResponse.class);
        smsResponseDto.builder().smsConfirmNum(smsConfirmNum).build();
        redisUtil.setData("sms:verification:" + messageDto.getTo(), smsConfirmNum, 3, TimeUnit.MINUTES); // 유효시간 3분
        return smsResponseDto;
    }

    @Transactional
    public CommonResponse smsAuthentication(MessageAuthDTO dto) {
        log.info("------------------------------------------------");
        log.info("service smsAuthentication enter");
        log.info("------------------------------------------------");
        // Redis에서 인증 코드 조회
        String storedCode = redisUtil.getData("sms:verification:" + dto.getPhoneNumber());
        if (storedCode == null) {
            throw new CustomException(ExceptionStatus.EMAIL_NOT_FOUND); // 인증 코드가 존재하지 않는 경우
        }

        log.info("------------------------------------------------");
        log.info("storedCode = {}, dto.getCode() = {}",storedCode,dto.getCode());
        log.info("------------------------------------------------");

        // 인증 코드 확인
        if (!storedCode.equals(dto.getCode())) {
            throw new CustomException(ExceptionStatus.CODE_MISMATCH); // 인증 코드가 일치하지 않는 경우 예외 발생
        }

        // 인증 성공 시 처리 로직
        redisUtil.deleteData("email:verification:" + dto.getPhoneNumber());

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage());

    }
}
