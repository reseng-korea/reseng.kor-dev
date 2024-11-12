package com.resengkor.management.domain.document.service;


import com.resengkor.management.domain.document.dto.DocumentDetailResponse;
import com.resengkor.management.domain.document.dto.DocumentRequest;
import com.resengkor.management.domain.document.dto.DocumentResponse;
import com.resengkor.management.domain.document.entity.Document;
import com.resengkor.management.domain.document.entity.DocumentType;
import com.resengkor.management.domain.document.repository.DocumentRepository;
import com.resengkor.management.domain.file.entity.FileEntity;
import com.resengkor.management.domain.file.repository.FileRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.s3.service.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {
    private final S3Service s3Service;
    private final FileRepository fileRepository;
    private final DocumentRepository documentRepository;


    //생성
    @Transactional
    public CommonResponse createDocument(String type,DocumentRequest dto) {
        Document document = Document.builder()
                .type(DocumentType.valueOf(type.toUpperCase()))
                .title(dto.getTitle())
                .date(dto.getDate())
                .content(dto.getContent())
                .build();

        dto.getFiles().forEach(fileRequest -> {
            FileEntity fileEntity = FileEntity.builder()
                    .fileName(fileRequest.getFileName())
                    .fileType(fileRequest.getFileType())
                    .fileUrl(fileRequest.getFileUrl())
                    .build();
            document.addFile(fileEntity);
        });
        documentRepository.save(document);

        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(), ResponseStatus.CREATED_SUCCESS.getMessage());
    }

    //조회
    public DataResponse<Page<DocumentResponse>> getDocumentList(String type,int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Document> documentPage = documentRepository.findByType(DocumentType.valueOf(type.toUpperCase()), pageRequest);

        Page<DocumentResponse> documentResponsePage = documentPage.map(DocumentResponse::fromEntity);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), documentResponsePage);
    }

    //세부 사항 조회
    public DataResponse<DocumentDetailResponse> getDocumentDetail(String type,Long documentId) {
        Document document = documentRepository.findByIdAndType(documentId, DocumentType.valueOf(type.toUpperCase()))
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        DocumentDetailResponse detailResponse = DocumentDetailResponse.fromEntity(document);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), detailResponse);
    }

    //수정
    @Transactional
    public CommonResponse updateDocument(String type,Long documentId, DocumentRequest request) {
        Document document = documentRepository.findByIdAndType(documentId, DocumentType.valueOf(type.toUpperCase()))
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        document.update(request.getTitle(), request.getDate(), request.getContent());

        document.getFiles().clear();  // 기존 파일 제거
        request.getFiles().forEach(fileRequest -> {
            FileEntity newFile = FileEntity.builder()
                    .fileName(fileRequest.getFileName())
                    .fileType(fileRequest.getFileType())
                    .fileUrl(fileRequest.getFileUrl())
                    .build();
            document.addFile(newFile);  // 연관관계 편의 메서드 사용
        });
        return new CommonResponse(ResponseStatus.UPDATED_SUCCESS.getCode(), ResponseStatus.UPDATED_SUCCESS.getMessage());
    }

    //삭제
    @Transactional
    public CommonResponse deleteDocument(String type, Long documentId) {
        // 파일 이름 목록 조회
        List<FileEntity> files = fileRepository.findByDocumentId(documentId);

        // S3에서 파일 삭제
        files.forEach(file -> s3Service.deleteFileFromS3(file.getFileName()));

        // 게시물 삭제
        documentRepository.deleteById(documentId);

        // DB에서 파일 삭제
        fileRepository.deleteAll(files);

        return new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(),
                ResponseStatus.DELETED_SUCCESS.getMessage());
    }

    public ResponseEntity<byte[]> downloadDocumentFile(String type, Long fileId) {
        // 파일 ID를 통해 해당 파일 찾기
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // S3에서 파일 다운로드
        return s3Service.downloadFileFromS3(file.getFileName());
    }
}
