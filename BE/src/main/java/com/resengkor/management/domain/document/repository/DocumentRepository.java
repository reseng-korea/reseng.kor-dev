package com.resengkor.management.domain.document.repository;

import com.resengkor.management.domain.document.entity.Document;
import com.resengkor.management.domain.document.entity.DocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface DocumentRepository extends JpaRepository<Document, Long> {
    //카테고리에 따른 목록 조회
    Page<Document> findByType(DocumentType type, Pageable pageable);

    // Document ID와 Type을 기준으로 문서 조회(세부)
    Optional<Document> findByIdAndType(Long documentId, DocumentType type);
}
