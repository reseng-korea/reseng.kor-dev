package com.resengkor.management.global.security.jwt.util;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class JWTUtil {
    //jwt 발급 및 검증
    private final SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}")String secret) {

        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getEmail(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email", String.class);
    }

    public Long getUserId(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userId", Long.class);
    }

    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public String getCategory(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    public String getLoginType(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("loginType", String.class);
    }

    public Boolean getIsAuto(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("isAuto", Boolean.class);
    }

    public String getSessionId(String token) {
        //다중 로그인을 위해 한 번 로그인 할 때마다 session Id 발급
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("sessionId", String.class);
    }



    public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    //일반 jwt
    public String createJwt(String category, String loginType, String email, long userId, String role, Long expiredMs,boolean isAuto,String sessionId) {

        return Jwts.builder()
                .claim("category", category) //access인지, refresh인지 판단
                .claim("loginType",loginType)
                .claim("email", email)
                .claim("userId", userId)
                .claim("role", role)
                .claim("isAuto",isAuto) //로그인 유지인지 아닌지
                .claim("sessionId", sessionId) // 외부에서 받은 sessionId 사용
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) //유효기간
                .signWith(secretKey)
                .compact();
    }

    //oauth jwt
    public String createOuathJwt(String category, String loginType, String email, long userId, String role, Long expiredMs, String sessionId) {
        return Jwts.builder()
                .claim("category", category) //access인지, refresh인지 판단
                .claim("loginType",loginType)
                .claim("email", email)
                .claim("userId", userId)
                .claim("role", role)
                .claim("sessionId", sessionId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) //유효기간
                .signWith(secretKey)
                .compact();
    }
}
