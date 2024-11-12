package com.resengkor.management.global.security.oauth.service;

import com.resengkor.management.domain.user.entity.*;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.oauth.dto.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;

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
        log.info("------------------------------------------------");
        log.info("getAttributes : {}",oAuth2User.getAttributes());
        log.info("------------------------------------------------");

        // 존재하는 provider 인지 확인
        if (clientName.equals("kakao")) {
            response = new KakaoResponse(oAuth2User.getAttributes());
        } else if (clientName.equals("google")) {
            response = new GoogleResponse(oAuth2User.getAttributes());
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
            //email과 phone status는 추가 정보에서 false에서 인증받고 true로 바꾸는 걸로
            //일단 기본값 false
            user = User.builder()
                    .email(response.getEmail())
                    .representativeName(response.getName())
                    .phoneNumber(response.getPhoneNumber())
                    .role(Role.ROLE_PENDING)
                    .loginType(LoginType.SOCIAL)
                    .status(true)
                    .socialProvider(soialProvider)
                    .socialId(response.getSocialProviderId())
                    .build();
            user = userRepository.save(user);

            // RoleHierarchy 생성 (상위 관계가 없는 일반 사용자는 자기 자신)
            RoleHierarchy roleHierarchy = RoleHierarchy.builder()
                    .ancestor(user)  // 상위 관계: 자신
                    .descendant(user)  // 하위 관계: 자신
                    .depth(0)  // 자기 자신과의 관계는 depth 0
                    .build();
            roleHierarchyRepository.save(roleHierarchy);

            // Entity 목적 순수하게 유지하기 위해서 dto 로 전달..
            OAuth2UserDTO oAuth2UserDto = OAuth2UserDTO.builder()
                    .userId(user.getId())
                    .representativeName(response.getName())
                    .email(response.getEmail())
                    .phoneNumber(response.getPhoneNumber())
                    .role("ROLE_PENDING")
                    .status(true)
                    .socialProvider(response.getSocialProvider())
                    .socialProviderId(response.getSocialProviderId())
                    .build();

            return new CustomOAuth2User(oAuth2UserDto);
        }
        else {
            log.info("------------------------------------------------");
            log.info("Email이 존재");
            log.info("------------------------------------------------");
            //존재하면 업데이트
            //그런데 핸드폰은 구글에서 없는 경우가 있어서 빼고,
            //이름 같은 경우도 바뀌지는 않을 것 같아서 일단 뺌
            //이메일이 소셜 이메일과 같을 수 있음
            if(!isExist.get().getLoginType().equals(LoginType.SOCIAL)){
                //같은 이메일이 있는데 타입을 보니 소셜이 아님 -> 이미 일반으로 가입함

                throw new OAuth2AuthenticationException(new OAuth2Error("member_already_register_local", "같은 이메일으로 일반회원으로 가입하셨습니다.", null));
            }

            user = isExist.get().toBuilder()
                    .socialId(response.getSocialProviderId()) // 소셜 ID 업데이트
                    .email(response.getEmail()) // 이메일 업데이트
                    .build();
            userRepository.save(user); // 업데이트된 사용자 정보 저장

            // Entity 목적 순수하게 유지하기 위해서 dto 로 전달..
            OAuth2UserDTO oAuth2UserDto = OAuth2UserDTO.builder()
                    .userId(isExist.get().getId())
                    .representativeName(isExist.get().getRepresentativeName())
                    .email(response.getEmail())
                    .phoneNumber(isExist.get().getPhoneNumber())
                    .role(isExist.get().getRole().getRole())
                    .status(isExist.get().isStatus())
                    .socialProvider(response.getSocialProvider())
                    .socialProviderId(response.getSocialProviderId())
                    .build();
            if (!oAuth2UserDto.isStatus()) {
                throw new OAuth2AuthenticationException(new OAuth2Error("member_inactive", "사용자가 비활성화되었습니다. 관리자에게 문의하세요", null));
            }

            return new CustomOAuth2User(oAuth2UserDto);
        }
    }
}
