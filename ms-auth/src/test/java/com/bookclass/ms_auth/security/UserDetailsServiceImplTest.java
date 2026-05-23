package com.bookclass.ms_auth.security;

import com.bookclass.ms_auth.model.entity.Role;
import com.bookclass.ms_auth.model.entity.RoleName;
import com.bookclass.ms_auth.model.entity.User;
import com.bookclass.ms_auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        Role testRole = Role.builder()
                .id(1L)
                .name(RoleName.DOCENTE)
                .build();

        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("encodedPassword")
                .email("test@test.com")
                .roles(Set.of(testRole))
                .active(true) // FIX: valor explícito para que shouldBeActiveWhenUserIsActive sea confiable
                .build();
    }

    @Test
    void shouldLoadUserByUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
    }

    @Test
    void shouldHaveCorrectAuthority() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_DOCENTE")));
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("unknown"));
    }

    @Test
    void shouldBeActiveWhenUserIsActive() {
        // testUser.active == true gracias al setUp explícito
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        assertTrue(userDetails.isEnabled());
    }

    @Test
    void shouldBeDisabledWhenUserIsInactive() {
        // FIX: caso faltante — usuario desactivado no debe poder autenticarse
        User inactiveUser = User.builder()
                .id(2L)
                .username("inactiveuser")
                .password("encodedPassword")
                .email("inactive@test.com")
                .roles(Set.of())
                .active(false)
                .build();

        when(userRepository.findByUsername("inactiveuser")).thenReturn(Optional.of(inactiveUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("inactiveuser");

        assertFalse(userDetails.isEnabled());
    }
}