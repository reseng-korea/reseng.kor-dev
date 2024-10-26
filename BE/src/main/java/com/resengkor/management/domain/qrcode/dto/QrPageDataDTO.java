package com.resengkor.management.domain.qrcode.dto;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class QrPageDataDTO {

    private String company; // 업체명
    private String clientName; // 고객명
    private String postedLocation; // 게시장소
    private LocalDate requestedDate; // 요청날짜
    private LocalDate postedDate; // 게시날짜
    private Integer typeWidth; // 현수막 폭
    private Integer requestedLength;  // 현수막 길이

}
