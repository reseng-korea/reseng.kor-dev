package com.resengkor.management.domain.faq.service;

import com.resengkor.management.domain.faq.dto.FaqDTO;
import com.resengkor.management.domain.faq.entity.Faq;
import com.resengkor.management.domain.faq.repository.FAQRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FAQService {
    private final FAQRepository faqRepository;

    // FAQ 목록 조회 (페이지네이션)
    public DataResponse<Page<FaqDTO>> getAllFaq(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Faq> faqPage = faqRepository.findAll(pageRequest);

        Page<FaqDTO> faqDTOPage = faqPage.map(faq -> FaqDTO.builder()
                .id(faq.getId())
                .title(faq.getTitle())
                .content(faq.getContent())
                .build());

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), faqDTOPage);
    }

    // FAQ 상세 조회
    public DataResponse<FaqDTO> getFaqDetails(Long faqId) {
        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        FaqDTO faqDTO = FaqDTO.builder()
                .id(faq.getId())
                .title(faq.getTitle())
                .content(faq.getContent())
                .build();

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), faqDTO);
    }
}
