package com.resengkor.management.domain.user.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OauthUserUpdateRequest {
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email
    private String email;

    @NotBlank(message = "업체명은 필수 입력 값입니다.")
    private String companyName;
    private String representativeName;

    @NotBlank(message = "핸드폰 번호는 필수 입력 값입니다.")
    private String phoneNumber;
    private String companyPhoneNumber;
    private String faxNumber;

    private Long cityId;
    private Long districtId;
    private String streetAddress;
    private String detailAddress;

}
