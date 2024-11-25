package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.document.entity.DocumentEntity;
import com.resengkor.management.domain.file.dto.FileRequest;
import com.resengkor.management.domain.file.dto.FileResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        // 이미지와 파일 리스트 생성
        List<FileResponse> imageFiles = new ArrayList<>();
        List<FileResponse> allFiles = new ArrayList<>();

        // 모든 파일 순회하며 조건에 따라 분류
        documentEntity.getFiles().forEach(file -> {
            FileResponse fileResponse = FileResponse.builder()
                    .fileId(file.getId())
                    .fileName(file.getFileName())
                    .fileUrl(file.getFileUrl())
                    .fileType(file.getFileType())
                    .build();

            System.out.println(file.getId() + ","+file.isFileImage());
            if (file.getFileType().startsWith("image/")) {
                if (file.isFileImage()) {
                    allFiles.add(fileResponse); // isFileImage가 true인 경우 files 리스트에 추가
                } else {
                    imageFiles.add(fileResponse); // isFileImage가 false인 경우 image 리스트에 추가
                }
            } else {
                allFiles.add(fileResponse); // image/가 아닌 파일은 files 리스트에 추가
            }
        });

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
