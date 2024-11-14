package com.resengkor.management.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .exposedHeaders("Set-Cookie") //노출할 헤더값은 쿠키 헤더
                .allowedOrigins("http://localhost:5173","https://reseng.co.kr"); //웹앱이 동작할 서버 주소
    }
}