package com.resengkor.management.domain.file.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class FileRequest {
    private String fileUrl;
    private String fileType;
    private String fileName;

    @Builder
    public FileRequest(String fileUrl, String fileType, String fileName) {
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileName = fileName;
    }
}
