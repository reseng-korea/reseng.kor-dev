package com.resengkor.management.domain.file.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class FileResponse {
    private Long id;
    private String url;
    private String name;
    private String fileType;

    @Builder
    public FileResponse(Long id, String url, String name, String fileType) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.fileType = fileType;
    }
}
