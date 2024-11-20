package com.resengkor.management.domain.document.controller;

import com.resengkor.management.domain.document.dto.DocumentDetailResponse;
import com.resengkor.management.domain.document.dto.DocumentRequest;
import com.resengkor.management.domain.document.dto.DocumentResponse;
import com.resengkor.management.domain.document.service.DocumentService;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
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
    @PostMapping("/{documentType}")
    public CommonResponse createDocument(@PathVariable("documentType") String documentType, @RequestBody DocumentRequest dto) {
        return documentService.createDocument(documentType,dto);
    }

    //전체 목록 조회
    @GetMapping("/{documentType}")
    public DataResponse<Page<DocumentResponse>> getDocumentList(@PathVariable("documentType") String documentType,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        return documentService.getDocumentList(documentType,page, size);
    }

    //세부 사항 조회
    @GetMapping("/{documentType}/{documentId}")
    public DataResponse<DocumentDetailResponse> getDocumentDetail(@PathVariable("documentType") String documentType, @PathVariable("documentId") Long documentId) {
        return documentService.getDocumentDetail(documentType,documentId);
    }

    //수정
    @PutMapping("/{documentType}/{documentId}")
    public CommonResponse updateDocument(@PathVariable("documentType") String documentType, @PathVariable("documentId") Long documentId, @RequestBody DocumentRequest request) {
        return documentService.updateDocument(documentType,documentId, request);
    }

    //삭제
    @DeleteMapping("/{documentType}/{documentId}")
    public CommonResponse deleteDocument(@PathVariable("documentType") String documentType, @PathVariable("documentId") Long documentId) {
        new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(), ResponseStatus.DELETED_SUCCESS.getMessage());
        return documentService.deleteDocument(documentType,documentId);
    }

    //다운로드
    @GetMapping(path = "/download/{documentType}/{fileId}")
    public ResponseEntity<UrlResource> downloadDocumentFile(@PathVariable("documentType") String documentType, @PathVariable("fileId") Long fileId){
        return documentService.downloadDocumentFile(documentType,fileId);
    }
}
