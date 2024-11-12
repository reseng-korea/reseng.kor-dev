package com.resengkor.management.domain.sms.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.domain.sms.dto.MessageAuthDTO;
import com.resengkor.management.domain.sms.dto.MessageDto;
import com.resengkor.management.domain.sms.dto.SmsRequest;
import com.resengkor.management.domain.sms.dto.SmsResponse;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.util.RedisUtil;
import com.resengkor.management.global.util.TmpCodeUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.utils.Base64;
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
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Configuration
@Slf4j
@RequiredArgsConstructor
@Service
public class SmsServiceWithRedis {
    //휴대폰 인증 번호
    private final String smsConfirmNum = TmpCodeUtil.generateNumericCode();
    private final RedisUtil redisUtil;
    private final UserRepository userRepository;

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

    //메세지 발송
    @Transactional
    public SmsResponse sendSms(MessageDto messageDto, String type) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
        //핸드폰 인증(만약 이미 존재하는 핸드폰이라면)
        Optional<User> existingUserByPhoneNumber = userRepository.findByPhoneNumber(messageDto.getTo());
        if (existingUserByPhoneNumber.isPresent()) {
            User user = existingUserByPhoneNumber.get();
            if (!user.isStatus()) {
                log.info("비활성 사용자입니다 (이메일 중복)");
                throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED); // 비활성 사용자 예외
            }
            log.info("사용자입니다 (전화번호 중복)");
            throw new CustomException(ExceptionStatus.USER_PHONE_NUMBER_ALREADY_EXIST); // 이미 존재하는 전화번호 예외
        }
        else{
            log.info("핸드폰 번호 사용 가능: " + messageDto.getTo());
            return sendDetailSms(messageDto,type,smsConfirmNum);
        }
    }

    @Transactional
    public SmsResponse sendDetailSms(MessageDto messageDto, String type, String tmpCode) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
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

        String contentMessage;
        if(type.equals("findPassword")){
            //임시 비밀번호 발급해주는 문자내용
            contentMessage = "[(주)리앤생] 임시 비밀번호는 [" + tmpCode + "]입니다. 로그인 후 비밀번호를 변경해 주세요.";
        }
        else{
            //핸드폰 인증해주는 문자내용
            contentMessage = "[(주)리앤생] 핸드폰 인증번호 [" + tmpCode + "]입니다.";
        }

        SmsRequest request = SmsRequest.builder()
                .type("SMS")
                .contentType("COMM")
                .countryCode("82")
                .from(phone)
                .content(contentMessage)
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
        smsResponseDto.builder().smsConfirmNum(tmpCode).build();
        redisUtil.setData("sms:verification:" + messageDto.getTo(), tmpCode, 3, TimeUnit.MINUTES); // 유효시간 3분
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
            throw new CustomException(ExceptionStatus.CODE_EXPIRED); // 인증 코드가 존재하지 않는 경우
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
