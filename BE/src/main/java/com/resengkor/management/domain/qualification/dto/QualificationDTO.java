package com.resengkor.management.domain.qualification.dto;

import com.resengkor.management.domain.qualification.entity.Qualification;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class QualificationDTO {
    private Long id;
    private String fileUrl;
    private String fileName;

    // Entity를 DTO로 변환하는 메서드
    public static QualificationDTO fromEntity(Qualification qualification) {
        return QualificationDTO.builder()
                .id(qualification.getId())
                .fileUrl(qualification.getFileUrl())
                .fileName(qualification.getFileName())
                .build();
    }
}
