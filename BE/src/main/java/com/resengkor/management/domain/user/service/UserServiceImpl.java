package com.resengkor.management.domain.user.service;



import com.resengkor.management.domain.user.dto.*;
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
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RegionRepository regionRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserMapper userMapper; // Mapper를 주입받음
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

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
    public DataResponse<?> registerUser(UserRegisterRequest request) {
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
                .emailStatus(true) //이미 인증한 이후에 생성되는 것이니까
                .password(passwordEncoder.encode(request.getPassword()))// 비밀번호 암호화
                .companyName(request.getCompanyName())
                .representativeName(request.getRepresentativeName())
                .phoneNumber(request.getPhoneNumber())
                .phoneNumberStatus(true) //이미 인증한 이후 생성
                .role(Role.ROLE_GUEST)  // 일반 사용자의 기본 역할 설정
                .loginType(LoginType.LOCAL)
                .status(true)
                .build();
        log.info("유저 생성");

        // Region 생성
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY").orElseThrow(() -> new RuntimeException("상위 지역을 찾을 수 없습니다."));; // 서울시 찾기
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT").orElseThrow(() -> new RuntimeException("하위 지역을 찾을 수 없습니다."));; // 강남구 찾기
        log.info("region 조회 성공");

        // UserProfile 생성 및 연결 (latitude, longitude 없이)
        UserProfile userProfile = UserProfile.builder()
                .fullAddress(request.getFullAddress())
                .city(city)
                .district(district)
                .user(user)  // User와 연결
                .build();
        userProfileRepository.save(userProfile);
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
        return new DataResponse<>(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage(),"일반 회원가입 성공");
    }

    //이메일 찾기
    public DataResponse<?> findEmail(FindEmailRequest request) {
        //없으면 에러 터뜨림
        User User = userRepository.findByCompanyNameAndPhoneNumber(request.getCompanyName(), request.getPhoneNumber())
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        log.info("맞는 회사명&핸드폰 번호 있음");
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), User.getEmail());
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
        refreshRepository.deleteByEmail(userEmail);
        log.info("------------------------------------------------");
        log.info("회원탈퇴:refresh 토큰 삭제");
        log.info("------------------------------------------------");

        return new CommonResponse(ResponseStatus.UPDATED_SUCCESS .getCode(),
                ResponseStatus.UPDATED_SUCCESS .getMessage());
    }


    //회원정보 추가
    @Transactional
    @PreAuthorize("#userId == principal.id")
    public DataResponse<?> oauthUpdateUser(Long userId, OauthUserUpdateRequest request) {
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

        // 4. 저장
        userRepository.save(user); // User 저장 시 UserProfile도 함께 저장

        log.info("회원 정보 수정 성공");

        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), "회원 정보 수정 성공");
    }

    @PreAuthorize("#userId == principal.id")
    @Transactional
    public DataResponse<?> updateUser(Long userId, UserUpdateRequest request) {
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

        // 6. 저장
        userRepository.save(user);

        log.info("회원 정보 수정 성공");

        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), "회원 정보 수정 성공");
    }

    //로그인한 사람인지
    private static void authorizeUser(User user){
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!user.getEmail().equals(userEmail)){
            throw new CustomException(ExceptionStatus.AUTHENTICATION_FAILED);
        }
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


    public DataResponse<?> tmp() {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
        System.out.println("user 조회 성공");
        Long id = user.getId();
        return new DataResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), id);
    }
}