package com.resengkor.management.domain.file.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class FileResponse {
    private Long fileId;
    private String fileName;
    private String fileType;

    @Builder
    public FileResponse(Long fileId, String fileName, String fileType) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileType = fileType;
    }
}
