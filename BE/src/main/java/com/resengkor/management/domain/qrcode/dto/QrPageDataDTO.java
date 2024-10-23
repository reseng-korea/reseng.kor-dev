package com.resengkor.management.domain.qrcode.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class QrPageDataDTO {

    private String company; // 업체명
    private Integer requestedLength;  // 현수막 길이
    private Integer typeWidth; // 현수막 종류
    private String clientName; // 고객명
    private LocalDate requestedDate; // 요청날짜
    private LocalDate postedDate; // 게시날짜
    private String postedLocation; // 게시장소
}
