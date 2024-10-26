package com.resengkor.management.domain.qrcode.controller;


import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QRCodeValidationController {

    private final BannerRequestRepository bannerRequestRepository;

    @Autowired
    public QRCodeValidationController(BannerRequestRepository bannerRequestRepository) {
        this.bannerRequestRepository = bannerRequestRepository;
    }

//    @GetMapping("/validateQR")
//    public ResponseEntity<QrPageDataDTO> validateQR(@RequestParam String uuid) {
//        return bannerRequestRepository.findByUuid(uuid)
//                .map(bannerRequest -> {
//                    // BannerRequest를 QrPageDTO로 변환
////                    QrPageDataDTO qrPageDataDTO = new QrPageDataDTO().toQRPageDataDTO(bannerRequest);
////                    return ResponseEntity.ok(qrPageDataDTO);
//                })
//                .orElseGet(() -> ResponseEntity.status(404).body(null));
//    }
}
