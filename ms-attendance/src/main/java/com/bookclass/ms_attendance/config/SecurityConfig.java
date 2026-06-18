package com.bookclass.ms_attendance.config;

import com.bookclass.ms_attendance.security.JwtAuthenticationFilter;
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
                // Attendance: DOCENTE/INSPECTOR can create, all auth can view their relevant data
                .requestMatchers(HttpMethod.POST, "/api/attendance/**").hasAnyRole("DOCENTE", "INSPECTOR", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.PUT, "/api/attendance/**").hasAnyRole("DOCENTE", "INSPECTOR", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.DELETE, "/api/attendance/**").hasAnyRole("DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.GET, "/api/attendance/**").authenticated()
                // Justifications: APODERADO can create, INSPECTOR/DIRECTOR approve
                .requestMatchers(HttpMethod.POST, "/api/justifications/**").hasAnyRole("APODERADO", "INSPECTOR", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.PUT, "/api/justifications/*/approve").hasAnyRole("INSPECTOR", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.DELETE, "/api/justifications/**").hasAnyRole("INSPECTOR", "DIRECTOR", "ADMIN_SISTEMA")
                .requestMatchers(HttpMethod.GET, "/api/justifications/**").authenticated()
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
