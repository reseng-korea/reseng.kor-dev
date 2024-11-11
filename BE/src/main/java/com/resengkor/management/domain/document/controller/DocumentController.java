package com.resengkor.management.domain.document.controller;

import com.resengkor.management.domain.document.dto.DocumentDetailResponse;
import com.resengkor.management.domain.document.dto.DocumentRequest;
import com.resengkor.management.domain.document.dto.DocumentResponse;
import com.resengkor.management.domain.document.service.DocumentService;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resengkor.management.global.response.ResponseStatus;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {
    private final DocumentService documentService;

    //생성
    @PostMapping("/{type}")
    public CommonResponse createDocument(@PathVariable String type, @RequestBody DocumentRequest dto) {
        return documentService.createDocument(type,dto);
    }

    //전체 목록 조회
    @GetMapping("/{type}")
    public DataResponse<Page<DocumentResponse>> getDocumentList(@PathVariable String type, @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        return documentService.getDocumentList(type,page, size);
    }

    //세부 사항 조회
    @GetMapping("/{type}/{documentId}")
    public DataResponse<DocumentDetailResponse> getDocumentDetail(@PathVariable String type, @PathVariable Long documentId) {
        return documentService.getDocumentDetail(type,documentId);
    }

    //수정
    @PutMapping("/{type}/{documentId}")
    public CommonResponse updateDocument(@PathVariable String type, @PathVariable Long documentId, @RequestBody DocumentRequest request) {
        return documentService.updateDocument(type,documentId, request);
    }

    //삭제
    @DeleteMapping("/{type}/{documentId}")
    public CommonResponse deleteDocument(@PathVariable String type, @PathVariable Long documentId) {
        new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(), ResponseStatus.DELETED_SUCCESS.getMessage());
        return documentService.deleteDocument(type,documentId);
    }

    //다운로드
    @GetMapping(path = "/download/{type}")
    public ResponseEntity<byte[]> downloadDocumentFile(@PathVariable String type, @RequestParam Long fileId){
        return documentService.downloadDocumentFile(type,fileId);
    }
}
