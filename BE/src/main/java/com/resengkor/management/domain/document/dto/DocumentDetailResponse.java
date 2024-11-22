package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.document.entity.DocumentEntity;
import com.resengkor.management.domain.file.dto.FileRequest;
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
    private List<FileResponse> images;
    private LocalDateTime createdAt;

    @Builder
    public DocumentDetailResponse(Long id, String type, String title, LocalDate date, String content, List<FileResponse> files,List<FileResponse> images, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.date = date;
        this.content = content;
        this.files = files;
        this.images = images;
        this.createdAt = createdAt;
    }

    public static DocumentDetailResponse fromEntity(DocumentEntity documentEntity) {
        // 이미지 파일 리스트 생성 (MIME 타입이 "image/"로 시작하는 파일을 이미지로 간주)
        List<FileResponse> imageFiles = documentEntity.getFiles().stream()
                .filter(file -> file.getFileType().startsWith("image/"))  // MIME 타입이 "image/"로 시작하는 경우 필터링
                .map(file -> FileResponse.builder()
                        .fileId(file.getId())
                        .fileName(file.getFileName())
                        .fileUrl(file.getFileUrl())
                        .fileType(file.getFileType())
                        .build())
                .collect(Collectors.toList());

        // 이미지 파일을 제외한 나머지 파일들만 담은 리스트
        List<FileResponse> allFiles = documentEntity.getFiles().stream()
                .filter(file -> !file.getFileType().startsWith("image/"))  // MIME 타입이 "image/"로 시작하는 파일 제외
                .map(file -> FileResponse.builder()
                        .fileId(file.getId())
                        .fileName(file.getFileName())
                        .fileUrl(file.getFileUrl())
                        .fileType(file.getFileType())
                        .build())
                .collect(Collectors.toList());

        // DocumentDetailResponse 반환
        return DocumentDetailResponse.builder()
                .id(documentEntity.getId())
                .type(documentEntity.getType().toString())
                .title(documentEntity.getTitle())
                .date(documentEntity.getDate())
                .content(documentEntity.getContent())
                .files(allFiles)  // 이미지 제외한 파일들을 files 리스트에 할당
                .images(imageFiles)  // 이미지 파일을 images 리스트에 할당
                .createdAt(documentEntity.getCreatedAt())
                .build();
    }
}
