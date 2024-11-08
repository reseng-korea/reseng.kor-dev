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
    private String content;
    private List<FileRequest> files;  // 파일 정보를 담은 DTO 리스트

    @Builder
    public DocumentRequest(String title, LocalDate date, String content, List<FileRequest> files) {
        this.title = title;
        this.date = date;
        this.content = content;
        this.files = files;
    }
}
