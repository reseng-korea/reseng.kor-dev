package com.resengkor.management.domain.document.repository;

import com.resengkor.management.domain.document.entity.DocumentEntity;
import com.resengkor.management.domain.document.entity.DocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    //카테고리에 따른 목록 조회
//    @Query("SELECT d FROM DocumentEntity d WHERE d.type = :type " +
//            "ORDER BY CASE WHEN :type = 'NEWS' THEN d.date ASC ELSE d.createdAt DESC END")
    Page<DocumentEntity> findByType(@Param("type") DocumentType type, Pageable pageable);

    // Document ID와 Type을 기준으로 문서 조회(세부)
    Optional<DocumentEntity> findByIdAndType(Long documentId, DocumentType type);
}
