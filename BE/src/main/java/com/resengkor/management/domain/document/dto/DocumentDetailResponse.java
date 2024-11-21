package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.document.entity.DocumentEntity;
import com.resengkor.management.domain.file.dto.FileResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class DocumentDetailResponse {
    private Long id;
    private String type;
    private String title;
    private LocalDate date;
    private String content;
    private List<FileResponse> files;
    private LocalDateTime createdAt;

    @Builder
    public DocumentDetailResponse(Long id, String type, String title, LocalDate date, String content, List<FileResponse> files,LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.date = date;
        this.content = content;
        this.files = files;
        this.createdAt = createdAt;
    }

    public static DocumentDetailResponse fromEntity(DocumentEntity documentEntity) {
        return DocumentDetailResponse.builder()
                .id(documentEntity.getId())
                .type(documentEntity.getType().toString())
                .title(documentEntity.getTitle())
                .date(documentEntity.getDate())
                .content(documentEntity.getContent())
                .files(documentEntity.getFiles().stream()
                        .map(file -> FileResponse.builder()
                                .fileId(file.getId())
                                .fileName(file.getFileName())
                                .fileUrl(file.getFileUrl())
                                .fileType(file.getFileType())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(documentEntity.getCreatedAt())
                .build();
    }
}
