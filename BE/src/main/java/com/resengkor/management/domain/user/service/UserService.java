package com.resengkor.management.domain.user.service;



import com.resengkor.management.domain.sms.dto.MessageDto;
import com.resengkor.management.domain.sms.service.SmsServiceWithRedis;
import com.resengkor.management.domain.user.dto.*;
import com.resengkor.management.domain.user.dto.request.*;
import com.resengkor.management.domain.user.dto.response.FindEmailResponse;
import com.resengkor.management.domain.user.repository.RegionRepository;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserProfileRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.domain.user.entity.*;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.RedisUtil;
import com.resengkor.management.global.util.TmpCodeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RegionRepository regionRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserMapper userMapper; // Mapper를 주입받음
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil; // RedisUtil 추가
    private final SmsServiceWithRedis smsService;
//    private final RefreshRepository refreshRepository;

    @Transactional(readOnly = true)
    public Map<String, String> validateHandling(BindingResult bindingResult) {
        Map<String, String> validatorResult = new HashMap<>();

        for(FieldError error : bindingResult.getFieldErrors()) {
            String validKeyName = String.format("valid_%s", error.getField());
            validatorResult.put(validKeyName, error.getDefaultMessage());
        }

        return validatorResult;
    }

    @Transactional
    public DataResponse<UserDTO> registerUser(UserRegisterRequest request) {
        // 이미 존재하는지 확인하고 예외 던지기
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (!user.isStatus()) { // 비활성 상태 확인
                log.info("비활성 사용자입니다");
                throw new CustomException(ExceptionStatus.MEMBER_INACTIVE); // 비활성 사용자 예외
            }

            log.info("이미 존재함");
            throw new CustomException(ExceptionStatus.MEMBER_ALREADY_EXIST); // 이미 존재하는 멤버 예외
        }
        //unique한 것 중복되면 error 던지기

        // User 생성 (일반 사용자이므로 ROLE_GUEST 설정)
        User user = User.builder()
                .email(request.getEmail())
                .emailStatus(true) // 이미 인증한 이후에 생성되는 것이니까
                .password(passwordEncoder.encode(request.getPassword())) // 비밀번호 암호화
                .companyName(request.getCompanyName())
                .representativeName(request.getRepresentativeName())
                .phoneNumber(request.getPhoneNumber())
                .phoneNumberStatus(true) // 이미 인증한 이후 생성
                .role(Role.ROLE_GUEST)  // 일반 사용자의 기본 역할 설정
                .loginType(LoginType.LOCAL)
                .status(true)
                .build();
        log.info("유저 생성");

        // Region 생성
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY")
                .orElseThrow(() -> new RuntimeException("상위 지역을 찾을 수 없습니다.")); // 서울시 찾기
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT")
                .orElseThrow(() -> new RuntimeException("하위 지역을 찾을 수 없습니다.")); // 강남구 찾기
        log.info("region 조회 성공");

        // UserProfile 생성 및 연결 (latitude, longitude 없이)
        UserProfile userProfile = UserProfile.builder()
                .fullAddress(request.getFullAddress())
                .city(city)
                .district(district)
                .build();

        // 양방향 관계 설정
        user.changeUserProfile(userProfile); // User의 userProfile 설정

        userProfileRepository.save(userProfile); // UserProfile 먼저 저장
        log.info("프로파일 생성 성공");

        // User 저장
        User savedUser = userRepository.save(user);

        // RoleHierarchy 생성 (상위 관계가 없는 일반 사용자는 자기 자신)
        RoleHierarchy roleHierarchy = RoleHierarchy.builder()
                .ancestor(savedUser)  // 상위 관계: 자신
                .descendant(savedUser)  // 하위 관계: 자신
                .depth(0)  // 자기 자신과의 관계는 depth 0
                .build();
        roleHierarchyRepository.save(roleHierarchy);
        log.info("role 생성 성공");

        // UserMapper를 사용하여 User를 UserDTO로 변환
        UserDTO userDTO = userMapper.toUserDTO(savedUser);

        return new DataResponse<>(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage(), userDTO);
    }

    //이메일 찾기
    public DataResponse<FindEmailResponse> findEmail(FindEmailRequest request) {
        //없으면 에러 터뜨림
        User user = userRepository.findByCompanyNameAndPhoneNumber(request.getCompanyName(), request.getPhoneNumber())
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        log.info("맞는 회사명&핸드폰 번호 있음");
        // FindEmailResponse 객체 생성
        FindEmailResponse findEmailResponse = new FindEmailResponse();
        findEmailResponse.setEmail(user.getEmail()); // 이메일 설정

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), findEmailResponse);
    }

    @Transactional
    public DataResponse<String> findPassword(FindPasswordRequest request) {
        User user = userRepository.findByEmailAndPhoneNumber(request.getEmail(), request.getPhoneNumber())
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        log.info("맞는 이메일&핸드폰 번호 있음");

        // 2. 임시 비밀번호 생성
        String temporaryPassword = TmpCodeUtil.generateAlphanumericPassword();
        log.info("임시 비밀번호 생성: {}", temporaryPassword);

        // 3. SMS 전송
        MessageDto messageDto = new MessageDto(user.getPhoneNumber());
        try {
            smsService.sendDetailSms(messageDto,"findPassword",temporaryPassword);
        } catch (Exception e) {
            throw new CustomException(ExceptionStatus.SMS_SEND_FAIL);
        }

        // 4. 비밀번호 업데이트
        user.editPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(),"비밀번호 찾기 요청 성공");
    }

    //회원 탈퇴 로직
    @Transactional
    @PreAuthorize("#userId == principal.id")
    public CommonResponse withdrawUser(String token) {
        log.info("------------------------------------------------");
        log.info("회원탈퇴 로직 시작");
        log.info("------------------------------------------------");
        //1.JWT에서 사용자 이메일 추출
        String userEmail = jwtUtil.getEmail(token);
        //2.사용자 찾기
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        log.info("------------------------------------------------");
        log.info("회원탈퇴:사용자 찾음");
        log.info("------------------------------------------------");

        //3.만약에 로그인을 social로 했다면 따로 api 처리
        if(user.getLoginType().equals(LoginType.SOCIAL)){
            if(user.getSocialProvider().equals(SocialProvider.GOOGLE)){
                //만약에 구글

            }
            else if(user.getSocialProvider().equals(SocialProvider.KAKAO)){
                //만약에 카카오

            }
            else{

            }
        }
        //4.사용자 상태를 비활성으로 변경
        user.editStatus(false);
        userRepository.save(user);
        log.info("------------------------------------------------");
        log.info("회원탈퇴:사용자 비활성화");
        log.info("------------------------------------------------");

        //5.해당 유저의 refresh토큰 전부 삭제
//        refreshRepository.deleteByEmail(userEmail);
        redisUtil.deleteData("refresh:token:" + userEmail);
        log.info("------------------------------------------------");
        log.info("회원탈퇴:refresh 토큰 삭제");
        log.info("------------------------------------------------");

        return new CommonResponse(ResponseStatus.UPDATED_SUCCESS .getCode(),
                ResponseStatus.UPDATED_SUCCESS .getMessage());
    }


    //회원정보 추가
    @Transactional
    @PreAuthorize("#userId == principal.id")
    public DataResponse<UserDTO> oauthUpdateUser(Long userId, OauthUserUpdateRequest request) {
        //1.사용자 조회 (존재하지 않으면 예외 던지기)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        // 이메일 및 전화번호 중복 검사
        validateUniqueEmailAndPhoneNumber(userId, request.getEmail(), request.getPhoneNumber());

        //2.사용자 정보 추가
        user.updateUser(request.getEmail(), request.getCompanyName(),
                request.getRepresentativeName(), request.getPhoneNumber());
        // 3. UserProfile 조회 및 정보 업데이트
        UserProfile userProfile = user.getUserProfile();

        // 지역 조회 (지역 변경 시 사용)
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY")
                .orElseThrow(() -> new RuntimeException("상위 지역을 찾을 수 없습니다."));
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT")
                .orElseThrow(() -> new RuntimeException("하위 지역을 찾을 수 없습니다."));

        // UserProfile 정보 업데이트
        userProfile.updateProfileInfo(request.getFullAddress(), city, district);
        user.changeUserProfile(userProfile); // 양방향 관계 설정

        // 4. 저장
        userRepository.save(user); // User 저장 시 UserProfile도 함께 저장

        log.info("회원 정보 수정 성공");

        // UserMapper를 사용하여 User를 UserDTO로 변환
        UserDTO userDTO = userMapper.toUserDTO(user);

        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), userDTO);
    }

    @PreAuthorize("#userId == principal.id")
    @Transactional
    public DataResponse<UserDTO> updateUser(Long userId, UserUpdateRequest request) {
        //1.사용자 조회 (존재하지 않으면 예외 던지기)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        //2. 비밀번호 확인 후 설정
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.editPassword(encodedPassword); // 비밀번호 수정

        // 이메일 및 전화번호 중복 검사
        validateUniqueEmailAndPhoneNumber(userId, request.getEmail(), request.getPhoneNumber());

        //3.사용자 정보 추가
        //중복되면 안 됌
        user.updateUser(request.getEmail(), request.getCompanyName(),
                request.getRepresentativeName(), request.getPhoneNumber());

        // 4. 지역 정보 조회
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY")
                .orElseThrow(() -> new RuntimeException("상위 지역을 찾을 수 없습니다."));
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT")
                .orElseThrow(() -> new RuntimeException("하위 지역을 찾을 수 없습니다."));

        // 5. UserProfile 정보 수정
        UserProfile userProfile = user.getUserProfile();
        userProfile.updateProfileInfo(request.getFullAddress(), city, district);
        user.changeUserProfile(userProfile); // 양방향 관계 설정

        // 6. 저장
        userRepository.save(user);

        log.info("회원 정보 수정 성공");


        UserDTO userDTO = userMapper.toUserDTO(user);

        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), userDTO);
    }

    private void validateUniqueEmailAndPhoneNumber(Long userId, String email, String phoneNumber) {
        // 이메일 중복 검사
        Optional<User> existingUserByEmail = userRepository.findByEmail(email);
        if (existingUserByEmail.isPresent() && !Objects.equals(existingUserByEmail.get().getId(), userId)) {
            throw new CustomException(ExceptionStatus.MEMBER_EMAIL_ALREADY_EXIST);  // 이미 존재하는 이메일 예외
        }

        // 전화번호 중복 검사
        Optional<User> existingUserByPhoneNumber = userRepository.findByPhoneNumber(phoneNumber);
        if (existingUserByPhoneNumber.isPresent() && !Objects.equals(existingUserByPhoneNumber.get().getId(), userId)) {
            throw new CustomException(ExceptionStatus.MEMBER_PHONE_NUMBER_ALREADY_EXIST);  // 이미 존재하는 전화번호 예외
        }
    }


    public DataResponse<Long> tmp() {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        log.info("user 조회 성공");
        Long id = user.getId();
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), id);
    }


}