package com.resengkor.management.global.config;

import com.resengkor.management.global.security.jwt.filter.*;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.security.oauth.customhandler.OAuth2AuthenticationFailureHandler;
import com.resengkor.management.global.security.oauth.customhandler.OAuth2AuthenticationSuccessHandler;
import com.resengkor.management.global.security.oauth.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.resengkor.management.global.security.oauth.service.CustomOAuth2UserService;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

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
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    // POST로 허용할 엔드포인트 목록(role 상관없이 전체 접근 가능한 endpoint만!)
    private static final List<String> POST_LIST = List.of(
            "/api/v1/register",
            "/api/v1/oauth2-jwt-header",
            "/api/v1/find-email", "/api/v1/find-password", "/api/v1/reissue"
    );

    // GET으로 허용할 엔드포인트 목록(role 상관없이 전체 접근 가능한 endpoint만!)
    private static final List<String> GET_LIST = List.of(
            "/api/v1/check-email",
            "/api/v1/users/pagination",
            "/api/v1/regions/**", "/api/v1/companies/**",
            "/api/v1/faq/**",
            "api/v1/qr-code",
            "/api/v1/qna/questions/**",
            "/api/v1/qualifications"
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // cors
        http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();
                        //앞 단 프론트 서버 주소
                        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173","https://reseng.co.kr"));
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
        http.authorizeHttpRequests(auth -> {
                    configurePublicEndpoints(auth);
                    configureManagerEndpoints(auth);
                    configureUserEndpoints(auth);
                    configureDocumentsEndpoints(auth);
                    auth.anyRequest().authenticated(); // 나머지 모든 요청은 인증 필요
                })
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(customAuthenticationEntryPoint) // 인증 실패 시 처리
                        .accessDeniedHandler(customAccessDeniedHandler) // 권한 부족 시 처리
                );

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
                        .authorizationEndpoint(authorization -> authorization
                                .authorizationRequestRepository(httpCookieOAuth2AuthorizationRequestRepository)
                        )
                        .userInfoEndpoint(userinfo -> userinfo
                                .userService(customOAuth2UserService))
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler)
                        .permitAll());

        return http.build();
    }

    private void configurePublicEndpoints(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
        POST_LIST.forEach(url -> auth.requestMatchers(HttpMethod.POST, url).permitAll());
        GET_LIST.forEach(url -> auth.requestMatchers(HttpMethod.GET, url).permitAll());
        auth.requestMatchers("/api/v1/login", "/api/v1/logout",
                "/api/v1/mail/**", "/api/v1/sms/**", "/api/v1/users/withdrawal", "/api/v1/documents/**").permitAll();
    }

    private void configureManagerEndpoints(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
        auth.requestMatchers(HttpMethod.POST, "/api/v1/qualifications/**").hasRole("MANAGER");
        auth.requestMatchers(HttpMethod.PUT, "/api/v1/qualifications/**").hasRole("MANAGER");
        auth.requestMatchers(HttpMethod.DELETE, "/api/v1/qualifications/**").hasRole("MANAGER");
        auth.requestMatchers("/api/v1/admin/**", "/api/v1/qna/answers/**","/api/v1/s3/**").hasRole("MANAGER");
    }

    private void configureUserEndpoints(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
        auth.requestMatchers(HttpMethod.PUT, "/api/v1/users/oauth/{userId}").hasRole("PENDING");
        auth.requestMatchers("/api/v1/users/**").hasRole("GUEST");
        auth.requestMatchers(HttpMethod.POST, "/api/v1/qna/questions/**").hasRole("GUEST");
        auth.requestMatchers(HttpMethod.PUT, "/api/v1/qna/questions/**").hasRole("GUEST");
        auth.requestMatchers(HttpMethod.DELETE, "/api/v1/qna/questions/**").hasRole("GUEST");
    }

    private void configureDocumentsEndpoints(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
        auth.requestMatchers(HttpMethod.GET, "/api/v1/documents/{documentType}", "/api/v1/documents/{documentType}/{documentId}").permitAll();
        auth.requestMatchers(HttpMethod.POST, "/api/v1/documents/{documentType}").hasRole("MANAGER");
        auth.requestMatchers(HttpMethod.PUT, "/api/v1/documents/{documentType}/{documentId}").hasRole("MANAGER");
        auth.requestMatchers(HttpMethod.DELETE, "/api/v1/documents/{documentType}/{documentId}").hasRole("MANAGER");
        auth.requestMatchers(HttpMethod.GET, "/api/v1/documents/download/{documentType}/{fileId}").hasRole("CUSTOMER");
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
