package com.resengkor.management.global.security.oauth.service;

import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.SocialProvider;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.security.oauth.dto.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("OAuth2USer start");

        // userRequest -> registration 정보
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String clientName = userRequest.getClientRegistration().getClientName();

        OAuth2Response response = null;
        Map<String, Object> attributes = oAuth2User.getAttributes();

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
        CustomOAuth2User customOAuth2User = null;

        User isExist = userRepository.findByEmail(response.getEmail());
        if (isExist  == null) {
            //존재하지 않는다면
            //새로 만듦
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
            User oAuth2UserEntity = User.builder()
                    .socialProvider(soialProvider)
                    .socialId(response.getSocialId())
                    .email(response.getEmail())
                    .emailStatus(1)
                    .role(Role.ROLE_GUEST)
                    .build();
            userRepository.save(oAuth2UserEntity);

            // Entity 목적 순수하게 유지하기 위해서 dto 로 전달..
            OAuth2UserDto oAuth2UserDto = OAuth2UserDto.builder()
                    .socialProvider(response.getSocialProvider())
                    .socialId(response.getSocialId())
                    .name(response.getName())
                    .email(response.getEmail())
                    .emailStatus(1)
                    .role("ROLE_GUEST")
                    .build();

            return new CustomOAuth2User(oAuth2UserDto);
        }
        else {
            //존재하면 업데이트
            User updatedUser = isExist.toBuilder()
                    .socialId(response.getSocialId()) // 소셜 ID 업데이트
                    .representativeName(response.getName())
                    .email(response.getEmail()) // 이메일 업데이트
                    .emailStatus(1) // 이메일 상태 업데이트
                    .build();
            userRepository.save(updatedUser); // 업데이트된 사용자 정보 저장

            // Entity 목적 순수하게 유지하기 위해서 dto 로 전달..
            OAuth2UserDto oAuth2UserDto = OAuth2UserDto.builder()
                    .socialProvider(response.getSocialProvider())
                    .socialId(response.getSocialId())
                    .name(response.getName())
                    .email(response.getEmail())
                    .emailStatus(1)
                    .role(isExist.getRole().getRole())
                    .build();
            return new CustomOAuth2User(oAuth2UserDto);
        }
    }
}
