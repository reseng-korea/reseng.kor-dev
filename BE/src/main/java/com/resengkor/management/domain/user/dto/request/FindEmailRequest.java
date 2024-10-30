package com.resengkor.management.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FindEmailRequest {
    @NotBlank(message = "업체명은 필수입니다.")
    private String companyName;

    @NotBlank(message = "핸드폰 번호는 필수 입력 값입니다.")
    private String phoneNumber;
}
