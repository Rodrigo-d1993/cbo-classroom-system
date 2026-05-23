package com.bookclass.ms_auth.security;

import com.bookclass.ms_auth.config.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("dGVzdC1zZWNyZXQta2V5LWZvci10ZXN0aW5nLW9ubHktbWluLTI1Ni1iaXRz");
        properties.setExpiration(86400000L);

        jwtService = new JwtService(properties);
    }

    @Test
    void shouldGenerateToken() {
        String token = jwtService.generateToken("testuser", Map.of("role", "ADMIN_SISTEMA"));
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void shouldExtractUsername() {
        String token = jwtService.generateToken("testuser", Map.of("role", "ADMIN_SISTEMA"));
        String username = jwtService.extractUsername(token);
        assertEquals("testuser", username);
    }

    @Test
    void shouldValidateToken() {
        String token = jwtService.generateToken("testuser", Map.of("role", "ADMIN_SISTEMA"));
        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void shouldRejectInvalidToken() {
        assertFalse(jwtService.isTokenValid("invalid.token.here"));
    }
}