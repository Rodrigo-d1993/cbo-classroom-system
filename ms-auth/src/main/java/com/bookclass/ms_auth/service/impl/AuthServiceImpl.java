package com.bookclass.ms_auth.service.impl;

import com.bookclass.ms_auth.dto.request.LoginRequest;
import com.bookclass.ms_auth.dto.request.RegisterRequest;
import com.bookclass.ms_auth.dto.response.AuthResponse;
import com.bookclass.ms_auth.dto.response.UserResponse;
import com.bookclass.ms_auth.exception.ResourceNotFoundException;
import com.bookclass.ms_auth.model.entity.Role;
import com.bookclass.ms_auth.model.entity.RoleName;
import com.bookclass.ms_auth.model.entity.User;
import com.bookclass.ms_auth.repository.RoleRepository;
import com.bookclass.ms_auth.repository.UserRepository;
import com.bookclass.ms_auth.security.JwtService;
import com.bookclass.ms_auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("");

        String token = jwtService.generateToken(
                user.getUsername(),
                Map.of("role", role, "userId", user.getId())
        );

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(role)
                .build();
    }

    @Override
    public AuthResponse refresh(String token) {
        if (!jwtService.isTokenValid(token)) {
            throw new IllegalArgumentException("Invalid token");
        }

        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("");

        String newToken = jwtService.generateToken(
                user.getUsername(),
                Map.of("role", role, "userId", user.getId())
        );

        return AuthResponse.builder()
                .token(newToken)
                .username(user.getUsername())
                .role(role)
                .build();
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .createdAt(LocalDateTime.now())
                .roles(Set.of(role))
                .build();

        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUserRole(Long id, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        user.setRoles(Set.of(role));
        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Override
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(false);
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toSet()))
                .build();
    }
}