package com.resengkor.management.global.config;

import com.resengkor.management.global.security.jwt.filter.CustomLogoutFilter;
import com.resengkor.management.global.security.jwt.filter.JWTFilter;
import com.resengkor.management.global.security.jwt.filter.CustomLoginFilter;
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.service.RefreshTokenService;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.security.oauth.customhandler.CustomOAuth2SuccessHandler;
import com.resengkor.management.global.security.oauth.service.CustomOAuth2UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;


import java.io.IOException;
import java.util.Collections;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JWTUtil jwtUtil;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshRepository refreshRepository;



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler(){
        return new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                System.out.println("exception = " + exception);
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
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
                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                        //GET, POST, ... 모든 요청에 대해 허용
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        //Credentials값도 가져올 수 있도록 허용
                        configuration.setAllowCredentials(true);
                        //Headers도 어떤 헤더를 받을지 설정
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);

                        configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                        configuration.setExposedHeaders(Collections.singletonList("access"));

                        return configuration;
                    }
                }));

        http
                .csrf((auth) -> auth.disable())    //csrf disable
                .formLogin((auth) -> auth.disable())    //From 로그인 방식 disable
                .httpBasic((auth) -> auth.disable()); //http basic 인증 방식 disable

        // 경로별 인가 작업

        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/v1/register",
                                "/api/v1/find-email","/api/v1/find-password",
                                "/api/v1/login","/api/v1/logout",
                                "/api/v1/oauth", "/api/v1/oauth2-jwt-header",
                                "/api/v1/reissue","/api/v1/withdrawal",
                                "/api/v1/mail/**").permitAll()
                        //hasRole() : 특정 Roll을 가져야함
                        //제일 낮은 권한을 설정해주면 알아서 높은 얘들을 허용해줌
                        //아래 roleHierarchy() 메소드 덕분
                        //hasRole(), hasAnyRole 자동으로 ROLE_접두사 추가해줌
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/user/**").hasAnyRole("GUEST")
                        .anyRequest().authenticated());// 위에서 설정하지 못한 나머지 url을 여기서 다 처리

        http
                .addFilterBefore(new JWTFilter(jwtUtil), CustomLoginFilter.class); //JWTFilter가 CustomLoginFilter 전에 실행
        http
                .addFilterAt(new CustomLoginFilter("/api/v1/login", authenticationManager(authenticationConfiguration), jwtUtil, refreshRepository), UsernamePasswordAuthenticationFilter.class);
        http
                .addFilterBefore(new CustomLogoutFilter("/api/v1/logout", jwtUtil, refreshRepository), LogoutFilter.class);


        //세션 설정
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // oauth2
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userinfo) -> userinfo
                                .userService(customOAuth2UserService))
                        .successHandler(new CustomOAuth2SuccessHandler(jwtUtil, refreshTokenService))
                        .failureHandler(authenticationFailureHandler())
                        .permitAll());


        // 인가되지 않은 사용자에 대한 exception -> 프론트엔드로 코드 응답
        //이거 하니까 로그인도 안 됌
//        http.
//                exceptionHandling((exception) ->
//                exception
//                        .authenticationEntryPoint((request, response, authException) -> {
//                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                        }));

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
