package com.resengkor.management.domain.user.dto;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String email;
    private String password;
    private String companyName;
    private String representativeName;
    private String phoneNumber;

    private String profileAddress;
    //광역자치구, 지역자치구 처리 어케 할지
    private String regionName;
    private String regionType;
}