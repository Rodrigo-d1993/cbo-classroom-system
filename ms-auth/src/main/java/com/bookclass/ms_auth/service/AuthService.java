package com.bookclass.ms_auth.service;

import com.bookclass.ms_auth.dto.request.LoginRequest;
import com.bookclass.ms_auth.dto.request.RegisterRequest;
import com.bookclass.ms_auth.dto.response.AuthResponse;
import com.bookclass.ms_auth.dto.response.UserResponse;

import java.util.List;

public interface AuthService {

    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String token);
    UserResponse register(RegisterRequest request);
    UserResponse getUserById(Long id);
    UserResponse getUserByUsername(String username);
    List<UserResponse> getAllUsers();
    UserResponse updateUserRole(Long id, String roleName);
    void deactivateUser(Long id);
}