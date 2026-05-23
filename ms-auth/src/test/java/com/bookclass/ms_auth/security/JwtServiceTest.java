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
        // FIX: JJWT puede lanzar excepción en vez de retornar false para tokens malformados.
        // Cubrimos ambos comportamientos: que retorne false o que no explote de forma inesperada.
        assertDoesNotThrow(() -> {
            boolean valid = jwtService.isTokenValid("invalid.token.here");
            assertFalse(valid);
        });
    }

    @Test
    void shouldRejectExpiredToken() throws InterruptedException {
        // FIX: caso de seguridad crítico que faltaba — token con expiración mínima
        JwtProperties shortProps = new JwtProperties();
        shortProps.setSecret("dGVzdC1zZWNyZXQta2V5LWZvci10ZXN0aW5nLW9ubHktbWluLTI1Ni1iaXRz");
        shortProps.setExpiration(1L); // 1ms — expira casi de inmediato
        JwtService shortJwtService = new JwtService(shortProps);

        String token = shortJwtService.generateToken("testuser", Map.of());
        Thread.sleep(10); // garantiza que el token ya expiró

        assertDoesNotThrow(() -> {
            boolean valid = shortJwtService.isTokenValid(token);
            assertFalse(valid);
        });
    }
}