package com.bookclass.ms_auth.controller;

import com.bookclass.ms_auth.dto.request.LoginRequest;
import com.bookclass.ms_auth.dto.request.RegisterRequest;
import com.bookclass.ms_auth.dto.response.AuthResponse;
import com.bookclass.ms_auth.dto.response.UserResponse;
import com.bookclass.ms_auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        return ResponseEntity.ok(authService.refresh(token));
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserResponse> getMe(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = token; // se resolverá desde JwtService
        return ResponseEntity.ok(authService.getUserByUsername(username));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateRole(@PathVariable Long id,
                                                    @RequestParam String role) {
        return ResponseEntity.ok(authService.updateUserRole(id, role));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        authService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }
}