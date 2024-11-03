package com.resengkor.management.domain.qna.repository;

import com.resengkor.management.domain.qna.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
