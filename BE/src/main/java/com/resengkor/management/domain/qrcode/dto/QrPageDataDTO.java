package com.resengkor.management.domain.qrcode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder(toBuilder = true)
public class QrPageDataDTO {

    private String company; // 업체명
    private String clientName; // 고객명
    private String postedLocation; // 게시장소
    private LocalDate requestedDate; // 요청날짜
    private LocalDate postedDate; // 게시날짜
    private Integer typeWidth; // 현수막 폭
    @JsonInclude(JsonInclude.Include.NON_NULL) // Null인 경우 필드제거 후 반환
    private Integer postedDuration; // 게시기간
    @JsonInclude(JsonInclude.Include.NON_NULL) // Null인 경우 필드제거 후 반환
    private Integer horizontalLength; // 사용할 현수막 길이
    private Integer requestedLength;  // 현수막 길이
}
