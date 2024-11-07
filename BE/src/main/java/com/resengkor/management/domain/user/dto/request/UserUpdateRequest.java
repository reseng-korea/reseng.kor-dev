package com.resengkor.management.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String password;

    @NotBlank(message = "업체명은 필수 입력 값입니다.")
    private String companyName;

    @NotBlank(message = "대표자명은 필수 입력 값입니다.")
    private String representativeName;

    @NotBlank(message = "휴대폰 번호는 필수 입력 값입니다.")
    private String phoneNumber;

    @NotBlank(message = "광역자치구는 필수 입력 값입니다.")
    private String cityName;

    @NotBlank(message = "지역자치구는 필수 입력 값입니다.")
    private String districtName;

    @NotBlank(message = "주소는 필수 입력 값입니다.")
    private String fullAddress;
}
