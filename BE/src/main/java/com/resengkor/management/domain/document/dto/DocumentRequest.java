package com.resengkor.management.domain.document.dto;

import com.resengkor.management.domain.file.dto.FileRequest;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DocumentRequest {
    private String title;
    private LocalDate date;
    private String content; // 이미지는 html로 같이 저장
    private List<FileRequest> files;  // 파일 정보를 담은 DTO 리스트
    private List<FileRequest> images;

    @Builder
    public DocumentRequest(String title, LocalDate date, String content, List<FileRequest> files, List<FileRequest> images) {
        this.title = title;
        this.date = date;
        this.content = content;
        this.files = files;
        this.images = images;
    }
}
