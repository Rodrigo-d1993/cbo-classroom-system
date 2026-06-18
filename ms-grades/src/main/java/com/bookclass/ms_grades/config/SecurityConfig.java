package com.bookclass.ms_grades.config;

import com.bookclass.ms_grades.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/actuator/health",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                // Subjects: All authenticated users can view, only DOCENTE/DIRECTOR can modify
                .requestMatchers(HttpMethod.GET, "/api/subjects/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/subjects/**").hasAnyRole("DOCENTE", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.PUT, "/api/subjects/**").hasAnyRole("DOCENTE", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.DELETE, "/api/subjects/**").hasAnyRole("DIRECTOR", "ADMIN_SISTEMA")
                // Grades: DOCENTE/DIRECTOR can create/modify, students can view their own
                .requestMatchers(HttpMethod.GET, "/api/grades/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/grades/**").hasAnyRole("DOCENTE", "DIRECTOR")
                .requestMatchers(HttpMethod.PUT, "/api/grades/**").hasAnyRole("DOCENTE", "DIRECTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/grades/**").hasAnyRole("DIRECTOR", "ADMIN_SISTEMA")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:4200",
            "http://localhost:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
