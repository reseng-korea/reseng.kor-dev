package com.resengkor.management.domain.user.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @Pattern(regexp="(?=.*\\W)(?=\\S+$).{8,16}",
            message = "비밀번호는 특수문자가 적어도 1개 이상 포함된 8자 이상의 16자리 이하의 비밀번호여야 합니다.")
    private String oldPassword;

    @Pattern(regexp="(?=.*\\W)(?=\\S+$).{8,16}",
            message = "비밀번호는 특수문자가 적어도 1개 이상 포함된 8자 이상의 16자리 이하의 비밀번호여야 합니다.")
    private String newPassword;
}
