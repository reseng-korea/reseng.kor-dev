package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.document.entity.DocumentEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
public class DocumentResponse {
    private Long id;
    private String type;
    private String title;
    private LocalDate date;
    private String thumbnailUrl;
    private LocalDateTime createdAt;



    @Builder
    public DocumentResponse(Long id, String type, String title, LocalDate date,String thumbnailUrl, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.date = date;
        this.thumbnailUrl = thumbnailUrl;
        this.createdAt = createdAt;
    }

    public static DocumentResponse fromEntity(DocumentEntity documentEntity) {
        return DocumentResponse.builder()
                .id(documentEntity.getId())
                .type(documentEntity.getType().toString())
                .title(documentEntity.getTitle())
                .date(documentEntity.getDate())
                .thumbnailUrl(documentEntity.getThumbnailUrl())
                .createdAt(documentEntity.getCreatedAt())
                .build();
    }
}
