package com.bookclass.ms_auth.controller;

import com.bookclass.ms_auth.dto.request.LoginRequest;
import com.bookclass.ms_auth.dto.request.RegisterRequest;
import com.bookclass.ms_auth.dto.response.AuthResponse;
import com.bookclass.ms_auth.dto.response.UserResponse;
import com.bookclass.ms_auth.model.entity.RoleName;
import com.bookclass.ms_auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthResponse authResponse;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        authResponse = AuthResponse.builder()
                .token("mocked.jwt.token")
                .username("testuser")
                .role("DOCENTE")
                .build();

        // FIX: username alineado con el que retorna el mock en register_shouldReturn201
        // El mock retorna este objeto, así que los datos deben ser coherentes internamente.
        userResponse = UserResponse.builder()
                .id(1L)
                .username("newuser") // FIX: era "testuser", pero el request de register usa "newuser"
                .email("new@test.com")
                .active(true)
                .roles(Set.of("DOCENTE"))
                .build();
    }

    @Test
    void login_shouldReturn200() {
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        ResponseEntity<AuthResponse> response = authController.login(
                new LoginRequest("testuser", "password"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("mocked.jwt.token", response.getBody().getToken());
    }

    @Test
    void register_shouldReturn201() {
        when(authService.register(any(RegisterRequest.class))).thenReturn(userResponse);

        ResponseEntity<UserResponse> response = authController.register(
                new RegisterRequest("newuser", "password", "new@test.com", RoleName.DOCENTE));

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("newuser", response.getBody().getUsername()); // FIX: ahora coincide con el request
    }

    @Test
    void getAllUsers_shouldReturn200() {
        when(authService.getAllUsers()).thenReturn(List.of(userResponse));

        ResponseEntity<List<UserResponse>> response = authController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getUserById_shouldReturn200() {
        // Reutilizamos authResponse que sí tiene "testuser", o buscamos por id el user correcto.
        // Creamos un userResponse específico para este test para mayor claridad.
        UserResponse existingUser = UserResponse.builder()
                .id(1L)
                .username("testuser")
                .email("test@test.com")
                .active(true)
                .roles(Set.of("DOCENTE"))
                .build();

        when(authService.getUserById(1L)).thenReturn(existingUser);

        ResponseEntity<UserResponse> response = authController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("testuser", response.getBody().getUsername());
    }

    @Test
    void deactivateUser_shouldReturn204() {
        doNothing().when(authService).deactivateUser(1L);

        ResponseEntity<Void> response = authController.deactivateUser(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(authService, times(1)).deactivateUser(1L);
    }
}