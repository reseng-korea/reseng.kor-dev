package com.resengkor.management.domain.user.dto;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String email;
    private String password;
    private String companyName;
    private String phoneNumber;

    private String profileName;
    private String profileAddress;

    private String regionName;
    private String regionType;
}