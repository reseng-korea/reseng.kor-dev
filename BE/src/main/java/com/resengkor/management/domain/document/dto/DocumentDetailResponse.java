package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.document.entity.Document;
import com.resengkor.management.domain.file.dto.FileResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
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

    @Builder
    public DocumentDetailResponse(Long id, String type, String title, LocalDate date, String content, List<FileResponse> files) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.date = date;
        this.content = content;
        this.files = files;
    }

    public static DocumentDetailResponse fromEntity(Document document) {
        return DocumentDetailResponse.builder()
                .id(document.getId())
                .type(document.getType().toString())
                .title(document.getTitle())
                .date(document.getDate())
                .content(document.getContent())
                .files(document.getFiles().stream()
                        .map(file -> FileResponse.builder()
                                .fileId(file.getId())
                                .fileName(file.getFileName())
                                .fileType(file.getFileType())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
