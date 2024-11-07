package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.document.entity.Document;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;


@Data
public class DocumentResponse {
    private Long id;
    private String type;
    private String title;
    private LocalDate date;



    @Builder
    public DocumentResponse(Long id, String type, String title, LocalDate date) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.date = date;
    }

    public static DocumentResponse fromEntity(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .type(document.getType().toString())
                .title(document.getTitle())
                .date(document.getDate())
                .build();
    }
}
