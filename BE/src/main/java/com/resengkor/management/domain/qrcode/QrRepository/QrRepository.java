package com.resengkor.management.domain.qrcode.QrRepository;

import com.resengkor.management.domain.qrcode.entity.QR;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QrRepository extends JpaRepository<QR, Long> {
}
