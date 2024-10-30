package com.resengkor.management.global.security.oauth.service;

import com.resengkor.management.domain.user.entity.LoginType;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.SocialProvider;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.security.oauth.dto.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("------------------------------------------------");
        log.info("Enter CustomOAuth2UserService");
        log.info("------------------------------------------------");

        // userRequest -> registration 정보
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String clientName = userRequest.getClientRegistration().getClientName();

        OAuth2Response response = null;
        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.info("------------------------------------------------");
        log.info("getAttributes : {}",oAuth2User.getAttributes());
        log.info("------------------------------------------------");

        // 존재하는 provider 인지 확인
        if (clientName.equals("kakao")) {
            response = new KakaoResponse(attributes);
        } else if (clientName.equals("google")) {
            response = new GoogleResponse(attributes);
        } else {
            return null;
        }

        // provider name + provider Id 로 username(식별자) 생성
//        String username = response.getProvider() + " " + response.getProviderId();
        User user;

        Optional<User> isExist = userRepository.findByEmail(response.getEmail());
        log.info("------------------------------------------------");
        log.info("response.getEmail() = {}",response.getEmail());
        log.info("Email이 isExist = {}",isExist);
        log.info("------------------------------------------------");
        if (isExist.isEmpty()) {
            log.info("------------------------------------------------");
            log.info("Email이 존재하지 않음");
            log.info("------------------------------------------------");
            //존재하지 않는다면 새로 만듦
            SocialProvider soialProvider;
            if(response.getSocialProvider().equals("kakao")){
                soialProvider = SocialProvider.KAKAO;
            }
            else if(response.getSocialProvider().equals("google")){
                soialProvider = SocialProvider.GOOGLE;
            }
            else{
                soialProvider = null;
            }
            user = User.builder()
                    .socialProvider(soialProvider)
                    .socialId(response.getSocialId())
                    .email(response.getEmail())
                    .emailStatus(true)
                    .role(Role.ROLE_PENDING)
                    .loginType(LoginType.SOCIAL)
                    .status(true)
                    .build();
            user = userRepository.save(user);

            // Entity 목적 순수하게 유지하기 위해서 dto 로 전달..
            OAuth2UserDto oAuth2UserDto = OAuth2UserDto.builder()
                    .socialProvider(response.getSocialProvider())
                    .socialId(response.getSocialId())
                    .name(response.getName())
                    .email(response.getEmail())
                    .userId(user.getId())
                    .role("ROLE_PENDING")
                    .build();

            return new CustomOAuth2User(oAuth2UserDto);
        }
        else {
            log.info("------------------------------------------------");
            log.info("Email이 존재");
            log.info("------------------------------------------------");
            //존재하면 업데이트
            user = isExist.get().toBuilder()
                    .socialId(response.getSocialId()) // 소셜 ID 업데이트
                    .representativeName(response.getName())
                    .email(response.getEmail()) // 이메일 업데이트
                    .build();
            userRepository.save(user); // 업데이트된 사용자 정보 저장

            // Entity 목적 순수하게 유지하기 위해서 dto 로 전달..
            OAuth2UserDto oAuth2UserDto = OAuth2UserDto.builder()
                    .socialProvider(response.getSocialProvider())
                    .socialId(response.getSocialId())
                    .name(response.getName())
                    .email(response.getEmail())
                    .userId(isExist.get().getId())
                    .role(isExist.get().getRole().getRole())
                    .build();
            return new CustomOAuth2User(oAuth2UserDto);
        }
    }
}
