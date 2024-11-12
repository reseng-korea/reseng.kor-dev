package com.resengkor.management.domain.faq.controller;


import com.resengkor.management.domain.faq.dto.FaqDTO;
import com.resengkor.management.domain.faq.service.FAQService;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/faq")
@RequiredArgsConstructor
@Slf4j
public class FAQController {

    private final FAQService faqService;

    // FAQ 목록 조회 API
    @GetMapping
    public DataResponse<Page<FaqDTO>> getAllFaq(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        log.info("---------getAllFaq method start---------");
        return faqService.getAllFaq(page, size);
    }

    // FAQ 상세 조회 API
    @GetMapping("/{faqId}")
    public DataResponse<FaqDTO> getFaqDetails(@PathVariable Long faqId) {
        log.info("---------getFaqDetails method start---------");
        return faqService.getFaqDetails(faqId);
    }
}
