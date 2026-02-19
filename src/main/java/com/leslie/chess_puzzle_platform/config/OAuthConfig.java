package com.leslie.chess_puzzle_platform.config;

import com.leslie.chess_puzzle_platform.services.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@Slf4j
@EnableWebSecurity
public class OAuthConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    private final CustomOAuth2UserService oAuth2Service;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("SECURITY CONFIG LOADED");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth->auth
                        // allow get puzzles info by default but not making moves
                        .requestMatchers("/puzzles/**", "/themes/**", "/user-info").permitAll()
                        .anyRequest().authenticated() // any request need authentication
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(oAuth2Service))
                        .defaultSuccessUrl(frontendUrl, true))
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
        ;


        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
