package com.sentry.service;

import com.sentry.model.User;
import com.sentry.repository.UserRepository;
import com.sentry.service.serviceimpl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void testCreateUser_Success() {
        User user = User.builder()
                .username("testuser")
                .displayName("Test User")
                .passwordHash("hashedpwd")
                .build();

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User created = userService.createUser(user);
        assertNotNull(created);
        assertEquals("testuser", created.getUsername());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testCreateUser_BlankUsername_ThrowsException() {
        User user = User.builder()
                .username("")
                .displayName("Test User")
                .passwordHash("hashedpwd")
                .build();

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(user);
        });

        assertEquals("Username cannot be blank", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    public void testCreateUser_UsernameExists_ThrowsException() {
        User user = User.builder()
                .username("existing")
                .displayName("Test User")
                .passwordHash("hashedpwd")
                .build();

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(user);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }
}
