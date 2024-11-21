package com.resengkor.management.domain.file.repository;


import com.resengkor.management.domain.file.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long>{
    List<FileEntity> findByDocumentEntityId(Long documentId);
}
