package com.resengkor.management.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email
    private String email;

    @Pattern(regexp="(?=.*\\W)(?=\\S+$).{8,16}",
            message = "비밀번호는 특수문자가 적어도 1개 이상 포함된 8자 이상의 16자리 이하의 비밀번호여야 합니다.")
    private String password;

    @NotBlank(message = "업체명은 필수 입력 값입니다.")
    private String companyName;
    private String representativeName;

    @NotBlank(message = "휴대폰 번호는 필수 입력 값입니다.")
    private String phoneNumber;

    private String companyPhoneNumber;
    private String faxNumber;
    private String cityName;
    private String districtName;
    private String streetAddress;
    private String detailAddress;
}
