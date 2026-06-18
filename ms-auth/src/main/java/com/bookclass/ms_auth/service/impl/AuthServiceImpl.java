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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
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
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
            // Verificar si el usuario está activo
            if (!user.isActive()) {
                log.warn("Login attempt for inactive user: {}", request.getUsername());
                throw new BadCredentialsException("User account is inactive");
            }

            String role = user.getRoles().stream()
                    .findFirst()
                    .map(r -> r.getName().name())
                    .orElse("");

            String token = jwtService.generateToken(
                    user.getUsername(),
                    Map.of("role", role, "userId", user.getId())
            );
            
            log.info("Successful login for user: {} with role: {}", request.getUsername(), role);

            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .role(role)
                    .build();
                    
        } catch (AuthenticationException e) {
            log.warn("Failed login attempt for user: {} - Reason: {}", request.getUsername(), e.getMessage());
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    public String extractUsernameFromToken(String token) {
        return jwtService.extractUsername(token);
    }

    @Override
    public AuthResponse refresh(String token) {
        if (!jwtService.isTokenValid(token)) {
            log.warn("Attempt to refresh with invalid or expired token");
            throw new IllegalArgumentException("Invalid or expired token");
        }
        
        if (jwtService.isTokenExpired(token)) {
            log.warn("Attempt to refresh with expired token");
            throw new IllegalArgumentException("Token has expired");
        }

        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Verificar si el usuario sigue activo
        if (!user.isActive()) {
            log.warn("Refresh attempt for inactive user: {}", username);
            throw new IllegalArgumentException("User account is inactive");
        }

        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("");

        String newToken = jwtService.generateToken(
                user.getUsername(),
                Map.of("role", role, "userId", user.getId())
        );
        
        log.info("Token refreshed successfully for user: {}", username);

        return AuthResponse.builder()
                .token(newToken)
                .username(user.getUsername())
                .role(role)
                .build();
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration attempt with existing username: {}", request.getUsername());
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration attempt with existing email: {}", request.getEmail());
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
        log.info("User registered successfully: {} with role: {}", saved.getUsername(), request.getRole());
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

        String oldRole = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("NONE");

        Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        user.setRoles(Set.of(role));
        User saved = userRepository.save(user);
        
        log.info("User role updated - User: {}, Old Role: {}, New Role: {}", 
                 user.getUsername(), oldRole, roleName);
        
        return mapToUserResponse(saved);
    }

    @Override
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(false);
        userRepository.save(user);
        log.info("User deactivated: {} (ID: {})", user.getUsername(), id);
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
