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
    private final static String ENCODING_TYPE = "UTF-8";
    private final static String ALGORITHM = "HmacSHA256";

    //휴대폰 인증 번호
    private final String smsConfirmNum = TmpCodeUtil.generateNumericCode();

    private final RedisUtil redisUtil;
    private final UserRepository userRepository;

    @Value("${spring.naver-cloud-sms.accessKey}")
    private final String accessKey;

    @Value("${spring.naver-cloud-sms.secretKey}")
    private final String secretKey;

    @Value("${spring.naver-cloud-sms.serviceId}")
    private final String serviceId;

    @Value("${spring.naver-cloud-sms.senderPhone}")
    private final String phone;

    public String getSignature(final String time) throws NoSuchAlgorithmException, UnsupportedEncodingException, InvalidKeyException {
        final String space = " ";
        final String newLine = "\n";
        final String method = "POST";
        final String url = "/sms/v2/services/"+ this.serviceId+"/messages";
        final String accessKey = this.accessKey;
        final String secretKey = this.secretKey;

        final String message = method +
                space +
                url +
                newLine +
                time +
                newLine +
                accessKey;

        final SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes(ENCODING_TYPE), ALGORITHM);
        final Mac mac = Mac.getInstance(ALGORITHM);

        mac.init(signingKey);

        final byte[] rawHmac = mac.doFinal(message.getBytes(ENCODING_TYPE));

        return Base64.encodeBase64String(rawHmac);
    }

    //메세지 발송
    @Transactional
    public SmsResponse sendSms(
            final MessageDto messageDto,
            final String type
    ) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
        //핸드폰 인증(만약 이미 존재하는 핸드폰이라면)
        final Optional<User> existingUserByPhoneNumber = userRepository.findByPhoneNumber(messageDto.getTo());

        if (existingUserByPhoneNumber.isPresent()) {
            final User user = existingUserByPhoneNumber.get();

            if (!user.isStatus()) {
                log.info("비활성 사용자입니다");
                throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED); // 비활성 사용자 예외
            }

            log.info("사용자입니다 (핸드폰 번호 중복)");
            throw new CustomException(ExceptionStatus.USER_PHONE_NUMBER_ALREADY_EXIST); // 이미 존재하는 전화번호 예외
        } else {
            log.info("핸드폰 번호 사용 가능: " + messageDto.getTo());
            return sendDetailSms(messageDto,type,smsConfirmNum);
        }
    }

    @Transactional
    public SmsResponse sendDetailSms(
            final MessageDto messageDto,
            final String type,
            final String tmpCode
    ) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
        log.info("------------------------------------------------");
        log.info("service sendSms enter");
        log.info("------------------------------------------------");

        final String time = Long.toString(System.currentTimeMillis());

        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-ncp-apigw-timestamp", time);
        headers.set("x-ncp-iam-access-key", accessKey);
        headers.set("x-ncp-apigw-signature-v2", getSignature(time)); // signature 서명

        final List<MessageDto> messages = new ArrayList<>();
        messages.add(messageDto);

        final String contentMessage;

        if(type.equals("findPassword")){
            //임시 비밀번호 발급해주는 문자내용
            contentMessage = "[(주)리앤생] 임시 비밀번호는 [" + tmpCode + "]입니다. 로그인 후 비밀번호를 변경해 주세요.";
        } else {
            //핸드폰 인증해주는 문자내용
            contentMessage = "[(주)리앤생] 핸드폰 인증번호 [" + tmpCode + "]입니다.";
        }

        final SmsRequest request = SmsRequest.builder()
                .type("SMS")
                .contentType("COMM")
                .countryCode("82")
                .from(phone)
                .content(contentMessage)
                .messages(messages)
                .build();

        //쌓은 바디를 json형태로 반환
        final ObjectMapper objectMapper = new ObjectMapper();
        final String body = objectMapper.writeValueAsString(request);

        // jsonBody와 헤더 조립
        final HttpEntity<String> httpBody = new HttpEntity<>(body, headers);

        final RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());

        //restTemplate로 post 요청 보내고 오류가 없으면 202코드 반환
        final SmsResponse smsResponseDto = restTemplate.postForObject(
                new URI("https://sens.apigw.ntruss.com/sms/v2/services/"+ serviceId +"/messages"),
                httpBody,
                SmsResponse.class
        );
        smsResponseDto.builder().smsConfirmNum(tmpCode).build();

        redisUtil.setData("sms:verification:" + messageDto.getTo(), tmpCode, 3, TimeUnit.MINUTES); // 유효시간 3분

        return smsResponseDto;
    }

    @Transactional
    public CommonResponse smsAuthentication(final MessageAuthDTO dto) {
        log.info("------------------------------------------------");
        log.info("service smsAuthentication enter");
        log.info("------------------------------------------------");

        // Redis에서 인증 코드 조회
        final String storedCode = redisUtil.getData("sms:verification:" + dto.getPhoneNumber());

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
