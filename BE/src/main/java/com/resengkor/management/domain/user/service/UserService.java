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
import com.resengkor.management.global.security.oauth.service.KakaoUserWithdrawService;
import com.resengkor.management.global.util.RedisUtil;
import com.resengkor.management.global.util.TmpCodeUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.*;


@Service
@Getter
@Transactional(readOnly = true)
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
    private final KakaoUserWithdrawService kakaoUserWithdrawService;

    //테스트용
    public DataResponse<Long> tmp() {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        log.info("user 조회 성공");
        Long id = user.getId();
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), id);
    }

    //유효성 검사
    @Transactional(readOnly = true)
    public Map<String, String> validateHandling(BindingResult bindingResult) {
        Map<String, String> validatorResult = new HashMap<>();

        for(FieldError error : bindingResult.getFieldErrors()) {
            String validKeyName = String.format("valid_%s", error.getField());
            validatorResult.put(validKeyName, error.getDefaultMessage());
        }

        return validatorResult;
    }

    private void checkUserIsWithdrawed(User user){
        if (!user.isStatus()) {
            log.info("비활성 사용자입니다 (이메일 중복)");
            throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED); // 비활성 사용자 예외
        }
    }

    //로그인O
    //id, email, phoneNumber이 중복되는지 체크
    //이때는 같은 정보가 있다고 해도 내가 아니라 남의 정보라서 그 정보가 비활성화된 것인지 알려줄 필요x
    //update시 사용
    private void validateUniqueEmailAndPhoneNumberWithId(Long userId, String email, String phoneNumber) {
        // 1. 이메일 중복 검사
        Optional<User> existingUserByEmail = userRepository.findByEmail(email);
        if (existingUserByEmail.isPresent() && !Objects.equals(existingUserByEmail.get().getId(), userId)) {
            //요청보낸 사용자와 이메일의 사용자랑 다름 => 오류
            throw new CustomException(ExceptionStatus.USER_EMAIL_ALREADY_EXIST);  // 이미 존재하는 이메일 예외
        }

        // 2. 전화번호 중복 검사
        Optional<User> existingUserByPhoneNumber = userRepository.findByPhoneNumber(phoneNumber);
        if (existingUserByPhoneNumber.isPresent() && !Objects.equals(existingUserByPhoneNumber.get().getId(), userId)) {
            //요청보낸 사용자와 핸드폰번호의 사용자랑 다름 => 오류
            throw new CustomException(ExceptionStatus.USER_PHONE_NUMBER_ALREADY_EXIST);  // 이미 존재하는 전화번호 예외
        }
    }

    //로그인x
    //정보 찾으려고 하는데 내가 비활성화/중복되었다. 알려줄 필요 있음
    private void validateUniqueEmailAndPhoneNumber(String email, String phoneNumber) {
        // 1. 이메일 중복 검사
        Optional<User> existingUserByEmail = userRepository.findByEmail(email);
        if (existingUserByEmail.isPresent()) {
            User user = existingUserByEmail.get();
            checkUserIsWithdrawed(user); //비활성화된 이용자인지 확인
            log.info("사용자입니다 (이메일 중복)");
            throw new CustomException(ExceptionStatus.USER_EMAIL_ALREADY_EXIST); // 이미 존재하는 이메일 예외
        }

        // 2. 전화번호 중복 검사
        Optional<User> existingUserByPhoneNumber = userRepository.findByPhoneNumber(phoneNumber);
        if (existingUserByPhoneNumber.isPresent()) {
            User user = existingUserByPhoneNumber.get();
            checkUserIsWithdrawed(user); //비활성화된 이용자인지 확인
            log.info("사용자입니다 (전화번호 중복)");
            throw new CustomException(ExceptionStatus.USER_PHONE_NUMBER_ALREADY_EXIST); // 이미 존재하는 전화번호 예외
        }
    }

    //일반 회원 등록하기
    //로그인x
    @Transactional
    public DataResponse<UserDTO> registerUser(UserRegisterRequest request) {
        // 상황 : 핸드폰, 이메일 인증 완료한 상태
        // 이메일이 존재하는지 확인하고 예외 던지기
        validateUniqueEmailAndPhoneNumber(request.getEmail(), request.getPhoneNumber());

        // 1. User 생성 (일반 사용자이므로 ROLE_GUEST 설정)
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

        // 2. Region 찾아오기
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND)); // 서울시 찾기
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND)); // 강남구 찾기
        log.info("region 조회 성공");

        // 3. UserProfile 생성 및 연결 (latitude, longitude 없이)
        UserProfile userProfile = UserProfile.builder()
                .companyPhoneNumber(request.getCompanyPhoneNumber())
                .faxNumber(request.getFaxNumber())
                .streetAddress(request.getStreetAddress())
                .detailAddress(request.getDetailAddress())
                .city(city)
                .district(district)
                .build();

        // 4. 양방향 관계 설정
        user.updateUserUserProfile(userProfile); // User의 userProfile 설정
        userProfileRepository.save(userProfile); // UserProfile 먼저 저장
        log.info("프로파일 생성 성공");

        // 5. User 저장
        User savedUser = userRepository.save(user);

        // 6. RoleHierarchy 생성 (상위 관계가 없는 일반 사용자는 자기 자신)
        RoleHierarchy roleHierarchy = RoleHierarchy.builder()
                .ancestor(savedUser)  // 상위 관계: 자신
                .descendant(savedUser)  // 하위 관계: 자신
                .depth(0)  // 자기 자신과의 관계는 depth 0
                .build();
        roleHierarchyRepository.save(roleHierarchy);
        log.info("role 생성 성공");

        // 7. 응답 생성
        UserDTO userDTO = userMapper.toUserDTO(savedUser);

        return new DataResponse<>(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage(), userDTO);
    }

    //이메일 찾기
    //로그인 x
    public DataResponse<FindEmailResponse> findEmail(FindEmailRequest request) {
        //1. companyName과 phoneNumber로 사용자 차기 (없으면 에러 터뜨림)
        User user = userRepository.findByCompanyNameAndPhoneNumber(request.getCompanyName(), request.getPhoneNumber())
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        log.info("맞는 회사명&핸드폰 번호 있음");

        //2. 사용자는 찾은 상태. 그런데 비활성화된 이용자인지 확인
        checkUserIsWithdrawed(user);

        //3. FindEmailResponse 객체 생성
        FindEmailResponse findEmailResponse = new FindEmailResponse();
        findEmailResponse.setEmail(user.getEmail()); // 이메일 설정

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), findEmailResponse);
    }

    //비밀번호 찾기(이메일, 핸드폰 번호)
    //로그인x
    @Transactional
    public DataResponse<String> findPassword(FindPasswordRequest request) {
        //1. Email이랑 PhoneNumber로 사용자 찾기
        User user = userRepository.findByEmailAndPhoneNumber(request.getEmail(), request.getPhoneNumber())
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        log.info("맞는 이메일&핸드폰 번호 있음");

        //2. 사용자는 찾은 상태. 그런데 비활성화된 이용자인지 확인하기
        checkUserIsWithdrawed(user);

        //3. 임시 비밀번호 생성
        String temporaryPassword = TmpCodeUtil.generateAlphanumericPasswordWithSpecialChars();
        log.info("임시 비밀번호 생성: {}", temporaryPassword);

        //4. SMS 전송
        MessageDto messageDto = new MessageDto(user.getPhoneNumber());
        try {
            smsService.sendDetailSms(messageDto,"findPassword",temporaryPassword);
        } catch (Exception e) {
            throw new CustomException(ExceptionStatus.SMS_SEND_FAIL);
        }

        // 5. 비밀번호 업데이트
        user.editPassword(passwordEncoder.encode(temporaryPassword));
        //isTemporaryPassword true로 업뎃
        user.editTemporaryPasswordStatus(true);
        userRepository.save(user);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(),"비밀번호 찾기 요청 성공");
    }

    //회원 탈퇴 로직
    //로그인O
    @Transactional
    public CommonResponse withdrawUser(String token) {
        log.info("------------------------------------------------");
        log.info("회원탈퇴 로직 시작");
        log.info("------------------------------------------------");
        //1.JWT에서 사용자 이메일 추출
        String userEmail = jwtUtil.getEmail(token);
        //2.사용자 찾기
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        log.info("------------------------------------------------");
        log.info("회원탈퇴:사용자 찾음");
        log.info("------------------------------------------------");

        //3.만약에 로그인을 social로 했다면 따로 api 처리
        if(user.getLoginType().equals(LoginType.SOCIAL)){
            if(user.getSocialProvider().equals(SocialProvider.KAKAO)){
                String userId = user.getSocialId();
                //만약에 카카오
                kakaoUserWithdrawService.unlinkKakaoUser(userId);
            }
        }
        //4.사용자 상태를 비활성으로 변경
        user.editStatus(false);
        userRepository.save(user);
        log.info("------------------------------------------------");
        log.info("회원탈퇴:사용자 비활성화");
        log.info("------------------------------------------------");

        //5.해당 유저의 refresh토큰 전부 삭제
        boolean isDeleted = redisUtil.deleteData("refresh:token:" + userEmail);
        if (!isDeleted) {
            log.error("회원탈퇴: Refresh 토큰 삭제 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                "회원 탈퇴에 성공했습니다.");
    }


    //소셜 로그인 회원정보 추가(소셜 로그인 첫 회원가입시 바로 진행)
    //로그인O
    @Transactional
    public DataResponse<UserDTO> oauthUpdateUser(Long userId, OauthUserUpdateRequest request) {
        Long loginUserId = UserAuthorizationUtil.getLoginMemberId();
        if(!userId.equals(loginUserId)){
            throw new CustomException(ExceptionStatus.USER_NOT_MATCH);
        }

        // 1. 사용자 조회 (존재하지 않으면 예외 던지기)
        User user = userRepository.findById(loginUserId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        // 2. 이메일 및 전화번호 중복 검사
        validateUniqueEmailAndPhoneNumberWithId(loginUserId, request.getEmail(), request.getPhoneNumber());

        // 3. 사용자 정보 추가
        user.updateUser(request.getEmail(), request.getCompanyName(),
                request.getRepresentativeName(), request.getPhoneNumber());

        // 4. phoneStatus를 업데이트하고 Role을 PENDING에서 ROLE_GUEST로 승격
        user.updateStatusAndRole(true, true, Role.ROLE_GUEST);

        // 5. 지역 조회 (UserProfile이 null일 경우나 업데이트 시 모두 사용됨)
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 6. UserProfile 조회 및 초기화
        UserProfile userProfile = user.getUserProfile();
        String companyPhoneNumber = request.getCompanyPhoneNumber();
        String faxNumber = request.getFaxNumber();
        String  streetAddres = request.getStreetAddress();
        String detailAddress = request.getDetailAddress();
        if (userProfile == null) {
            //소셜은 기본적으로 회원가입시 user만 생성
            userProfile = UserProfile.builder()
                    .companyPhoneNumber(companyPhoneNumber)
                    .faxNumber(faxNumber)
                    .streetAddress(streetAddres)
                    .detailAddress(detailAddress)
                    .city(city)
                    .district(district)
                    .build();
            user.updateUserUserProfile(userProfile); // 양방향 관계 설정
            userProfileRepository.save(userProfile);
        } else {
            // UserProfile이 이미 존재하면 정보 업데이트
            userProfile.updateUserProfile(companyPhoneNumber, faxNumber, streetAddres, detailAddress, city, district);
        }

        // 7. 저장
        userRepository.save(user); // User 저장 시 UserProfile도 함께 저장
        log.info("회원 정보 수정 성공");

        // 8. 응답 생성
        UserDTO userDTO = userMapper.toUserDTO(user);

        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), userDTO);
    }

    //소셜+일반 사용자 정보 수정
    //로그인O
    @Transactional
    public DataResponse<UserDTO> updateUser(Long userId, UserUpdateRequest request) {
        Long loginUserId = UserAuthorizationUtil.getLoginMemberId();
        if(!userId.equals(loginUserId)){
            throw new CustomException(ExceptionStatus.USER_NOT_MATCH);
        }
        //1.사용자 조회 (존재하지 않으면 예외 던지기)
        User user = userRepository.findUserWithProfileAndRegionById(loginUserId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        //2. 비밀번호 확인 후 설정
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.editPassword(encodedPassword); // 비밀번호 수정

        //3. 이메일 및 전화번호 중복 검사
        validateUniqueEmailAndPhoneNumberWithId(loginUserId, request.getEmail(), request.getPhoneNumber());

        //4.사용자 정보 수정
        user.updateUser(request.getEmail(), request.getCompanyName(),
                request.getRepresentativeName(), request.getPhoneNumber());

        // 5. 지역 정보 조회
        Region city = regionRepository.findByRegionNameAndRegionType(request.getCityName(), "CITY")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        Region district = regionRepository.findByRegionNameAndRegionType(request.getDistrictName(), "DISTRICT")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 6. UserProfile 정보 수정
        String companyPhoneNumber = request.getCompanyPhoneNumber();
        String faxNumber = request.getFaxNumber();
        String  streetAddres = request.getStreetAddress();
        String detailAddress = request.getDetailAddress();
        UserProfile userProfile = user.getUserProfile();
        userProfile.updateUserProfile(companyPhoneNumber, faxNumber, streetAddres, detailAddress, city, district);

        // 7. 양방향 관계 설정
        user.updateUserUserProfile(userProfile);

        // 8. 저장
        userRepository.save(user);
        log.info("회원 정보 수정 성공");

        //9. 응답 생성
        UserDTO userDTO = userMapper.toUserDTO(user);
        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(), userDTO);
    }

    //사용자 정보 조회
    //로그인O
    public DataResponse<UserDTO> getUserInfo(Long userId) {
        Long loginUserId = UserAuthorizationUtil.getLoginMemberId();
        if(!userId.equals(loginUserId)){
            throw new CustomException(ExceptionStatus.USER_NOT_MATCH);
        }
        //1. 사용자 찾기
        User user = userRepository.findUserWithProfileAndRegionById(loginUserId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        //2. 응답 생성
        UserDTO userDTO = userMapper.toUserDTO(user);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), userDTO);
    }

    //비밀번호 확인(정보 확인용)
    //로그인O
    public DataResponse<String> verifyPassword(VerifyPasswordRequest verifyPasswordRequest) {
        //1. 로그인한 사용자id를 가지고 로그인한 user 객체 가져오기
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        log.info("DTO 패스워드 = {}",verifyPasswordRequest.getPassword());
        log.info("DB 패스워드 = {}",loginUser.getPassword());
        // 사용자가 입력한 비밀번호와 데이터베이스에 저장된 비밀번호 비교
        if (!passwordEncoder.matches(verifyPasswordRequest.getPassword(), loginUser.getPassword())) {
            log.info("비밀번호 불일치");
            throw new CustomException(ExceptionStatus.INVALID_PASSWORD); // 비밀번호 불일치 예외
        }

        log.info("비밀번호 확인 성공");
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(),
                "비밀번호 확인이 완료되었습니다.");
    }


    //임시번호 발급받은 상태인데, 비밀번호 변경 & 새로운 비밀번호로 변경
    //로그인 O
    @Transactional
    public DataResponse<String> resetPassword(ResetPasswordRequest resetPasswordRequest) {
        //1. 로그인한 사용자id를 가지고 로그인한 user 객체 가져오기
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        //2. 기존 비밀번호 확인
        if (!passwordEncoder.matches(resetPasswordRequest.getOldPassword(), loginUser.getPassword())) {
            log.info("기존 비밀번호 불일치");
            throw new CustomException(ExceptionStatus.INVALID_PASSWORD); // 비밀번호 불일치 예외
        }

        //3. 새 비밀번호로 변경
        loginUser.editPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword())); // 비밀번호 암호화
        userRepository.save(loginUser); // 변경된 사용자 정보 저장

        //4. 만약에 임시 비번 바꾸는 경우
        if(loginUser.isTemporaryPasswordStatus()){//true면 임시 비번인 상태
            loginUser.editTemporaryPasswordStatus(false);
        }

        log.info("비밀번호 변경 성공");
        return new DataResponse<>(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage(),
                "비밀번호가 성공적으로 변경되었습니다.");
    }


    //이메일 중복 확인하기
    //로그인 x
    public DataResponse<String> emailDupCheck(String email) {
        log.info("이메일 중복 확인하기");
        //검색하기 전에 유효한 이메일인지 확인
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        // 입력된 이메일을 사용하여 데이터베이스에서 사용자 검색
        Optional<User> existingUserByEmail = userRepository.findByEmail(email);
        if (existingUserByEmail.isPresent()) {
            User user = existingUserByEmail.get();
            checkUserIsWithdrawed(user); //비활성화된 이용자인지 확인
            log.info("사용자입니다 (이메일 중복)");
            throw new CustomException(ExceptionStatus.USER_EMAIL_ALREADY_EXIST); // 이미 존재하는 이메일 예외
        }

        log.info("이메일 사용 가능: " + email);
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(),
                "사용 가능한 이메일입니다.");
    }

    public DataResponse<UserListPaginationDTO> getAllUserByManager(int page, String role, String status, String createdDate) {

        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        Role userRole = loginUser.getRole();

        if(userRole == Role.ROLE_PENDING || userRole == Role.ROLE_GUEST)
            throw new CustomException(ExceptionStatus.FORBIDDEN_FAILED);

        List<Role> accessibleRoles = getAccessibleRoles(userRole);

        LocalDateTime createdAt = null;

        if(createdDate != null && !createdDate.isEmpty())
            createdAt = LocalDateTime.parse(createdDate);

        PageRequest pageRequest = PageRequest.of(page, 10);

        UserListPaginationDTO userListPaginationDTO = userRepository.getAllUserByManager(pageRequest, role, status, createdAt, accessibleRoles );

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), userListPaginationDTO);
    }

    public List<Role> getAccessibleRoles(Role userRole) {
        return switch (userRole) {
            case ROLE_MANAGER -> List.of(Role.ROLE_MANAGER, Role.ROLE_DISTRIBUTOR, Role.ROLE_AGENCY, Role.ROLE_CUSTOMER);
            case ROLE_DISTRIBUTOR -> List.of(Role.ROLE_DISTRIBUTOR, Role.ROLE_AGENCY, Role.ROLE_CUSTOMER);
            case ROLE_AGENCY -> List.of(Role.ROLE_AGENCY, Role.ROLE_CUSTOMER);
            case ROLE_PENDING, ROLE_GUEST -> null;
            case ROLE_CUSTOMER -> List.of(Role.ROLE_CUSTOMER);
        };
    }

    @Transactional
    public CommonResponse updateUserRole(UserRoleUpdateRequestDTO userRoleUpdateRequestDTO) {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        User targetUser = userRepository.findById(userRoleUpdateRequestDTO.getTargetUserId())
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        if(loginUser.getRole().getRank() <= targetUser.getRole().getRank())
            throw new CustomException(ExceptionStatus.ROLE_CHANGE_FAIL);

        List<Role> accessibleRoles = getAccessibleRoles(loginUser.getRole());

        if (!accessibleRoles.contains(userRoleUpdateRequestDTO.getTargetRole()) || userRoleUpdateRequestDTO.getTargetRole().getRank() >= loginUser.getRole().getRank())
            throw new CustomException(ExceptionStatus.ROLE_CHANGE_FAIL);

        targetUser.updateUserRole(userRoleUpdateRequestDTO.getTargetRole());

        return new CommonResponse(ResponseStatus.UPDATED_SUCCESS.getCode(), ResponseStatus.UPDATED_SUCCESS.getMessage());
    }
}