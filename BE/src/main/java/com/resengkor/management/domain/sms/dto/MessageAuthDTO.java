package com.resengkor.management.domain.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageAuthDTO {
    private String phoneNumber;
    private String code;
}
