package com.resengkor.management.global.config;

import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.security.jwt.filter.*;
//import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.service.RefreshTokenService;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.security.oauth.customhandler.CustomOAuth2SuccessHandler;
import com.resengkor.management.global.security.oauth.service.CustomOAuth2UserService;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;


import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final CustomOAuth2UserService customOAuth2UserService;
//    private final RefreshTokenService refreshTokenService;
//    private final RefreshRepository refreshRepository;
    private final UserRepository userRepository;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    // POST로 허용할 엔드포인트 목록(role 상관없이 전체 접근 가능한 endpoint만!)
    private static final List<String> POST_LIST = List.of(
            "/api/v1/register",
            "/api/v1/oauth2-jwt-header",
            "/api/v1/reissue"
    );

    // GET으로 허용할 엔드포인트 목록(role 상관없이 전체 접근 가능한 endpoint만!)
    private static final List<String> GET_LIST = List.of(
            "/api/v1/find-email", "/api/v1/find-password",
            "/api/v1/check-email",
            "/api/v1/withdrawal",
            "/api/v1/users/pagination",
            "/api/v1/regions/**", "/api/v1/companies/**",
            "/api/v1/faq/**",
            "api/v1/qr-code"
    );



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                log.info("exception = " + exception.getMessage());

                // 비활성화된 사용자 오류 메시지 확인
                if (exception instanceof OAuth2AuthenticationException) {
                    OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;
                    if ("member_inactive".equals(oauth2Exception.getError().getErrorCode())) {
                        // 비활성화된 사용자일 때 로그인 페이지로 리다이렉트
                        response.sendRedirect("http://localhost:5173/login?error=true&message=" + URLEncoder.encode("사용자가 비활성화되었습니다. 관리자에게 문의하세요.", StandardCharsets.UTF_8));
                        return; // 여기서 return 추가
                    }
                }
                // 일반적인 인증 실패 시
                response.sendRedirect("http://localhost:5173/login?error=true&message=" + URLEncoder.encode("인증에 실패했습니다.", StandardCharsets.UTF_8));
            }
        };
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // cors
        http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();
                        //앞 단 프론트 서버 주소
                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                        //GET, POST, ... 모든 요청에 대해 허용
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        //Credentials값도 가져올 수 있도록 허용
                        configuration.setAllowCredentials(true);
                        //Headers도 어떤 헤더를 받을지 설정
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);

                        configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                        configuration.setExposedHeaders(Arrays.asList("Authorization", "Refresh"));

                        return configuration;
                    }
                }));

        http
                .csrf((auth) -> auth.disable())    //csrf disable
                .formLogin((auth) -> auth.disable())    //From 로그인 방식 disable
                .httpBasic((auth) -> auth.disable()); //http basic 인증 방식 disable

        // 경로별 인가 작업

        http
                .authorizeHttpRequests(auth -> {
                        // POST 메서드에 대한 URL 허용
                        POST_LIST.forEach(url -> auth.requestMatchers(HttpMethod.POST, url).permitAll());

                        // GET 메서드에 대한 URL 허용
                        GET_LIST.forEach(url -> auth.requestMatchers(HttpMethod.GET, url).permitAll());

                        auth
                        .requestMatchers(
                                "/api/v1/login","/api/v1/logout",
                                "/api/v1/mail/**","/api/v1/sms/**","/api/v1/qna/questions/**","/api/v1/certificates/**").permitAll()
                                //hasRole() : 특정 Roll을 가져야함
                                //제일 낮은 권한을 설정해주면 알아서 높은 얘들을 허용해줌
                                //아래 roleHierarchy() 메소드 덕분
                                //hasRole(), hasAnyRole 자동으로 ROLE_접두사 추가해줌
                                .requestMatchers(HttpMethod.PUT, "/api/v1/users/oauth/{userId}").hasRole("PENDING")  // PENDING 권한 부여
                                .requestMatchers("/api/v1/users/**").hasAnyRole("GUEST")
                                .requestMatchers("/api/v1/admin/**","/api/v1/qna/answers/**").hasRole("ADMIN")
                        .anyRequest().authenticated();
                })
                .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(customAuthenticationEntryPoint) // 인증 실패 시 처리
                .accessDeniedHandler(customAccessDeniedHandler) // 권한 부족 시 처리
        );// 위에서 설정하지 못한 나머지 url을 여기서 다 처리

        http
                .addFilterBefore(new JWTFilter(jwtUtil), CustomLoginFilter.class); //JWTFilter가 CustomLoginFilter 전에 실행
        http
                .addFilterAt(new CustomLoginFilter("/api/v1/login", authenticationManager(authenticationConfiguration), jwtUtil, redisUtil), UsernamePasswordAuthenticationFilter.class);
        http
                .addFilterBefore(new CustomLogoutFilter("/api/v1/logout", jwtUtil, redisUtil), LogoutFilter.class);


        //세션 설정
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // oauth2
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userinfo) -> userinfo
                                .userService(customOAuth2UserService))
                        .successHandler(new CustomOAuth2SuccessHandler(jwtUtil, redisUtil))
                        .failureHandler(authenticationFailureHandler())
                        .permitAll());

        return http.build();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        return RoleHierarchyImpl.withDefaultRolePrefix()
                .role("MANAGER").implies("DISTRIBUTOR")
                .role("DISTRIBUTOR").implies("AGENCY")
                .role("AGENCY").implies("CUSTOMER")
                .role("CUSTOMER").implies("GUEST")
                .build();
    }
}
