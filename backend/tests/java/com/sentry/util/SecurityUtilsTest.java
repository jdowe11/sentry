package com.sentry.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityUtilsTest {

    @Test
    public void testGetUserIdFromAuthHeader_Success() {
        Long userId = SecurityUtils.getUserIdFromAuthHeader("Bearer 123");
        assertEquals(123L, userId);
    }

    @Test
    public void testGetUserIdFromAuthHeader_SuccessWithWhitespace() {
        Long userId = SecurityUtils.getUserIdFromAuthHeader("Bearer  456  ");
        assertEquals(456L, userId);
    }

    @Test
    public void testGetUserIdFromAuthHeader_NullHeader_ThrowsException() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            SecurityUtils.getUserIdFromAuthHeader(null);
        });
        assertEquals("Missing Authorization header", exception.getMessage());
    }

    @Test
    public void testGetUserIdFromAuthHeader_EmptyHeader_ThrowsException() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            SecurityUtils.getUserIdFromAuthHeader("   ");
        });
        assertEquals("Missing Authorization header", exception.getMessage());
    }

    @Test
    public void testGetUserIdFromAuthHeader_InvalidToken_ThrowsException() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            SecurityUtils.getUserIdFromAuthHeader("Bearer abc");
        });
        assertEquals("Invalid Authorization token", exception.getMessage());
    }
}
