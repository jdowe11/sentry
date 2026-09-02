package com.sentry.common.util;

public class SecurityUtils {

    /**
     * Extracts the user ID from the standard Authorization header (formatted as "Bearer <userId>").
     *
     * @param authHeader the Authorization header value
     * @return the extracted user ID as a Long
     * @throws IllegalArgumentException if the header is missing, malformed, or the token is not a valid user ID
     */
    public static Long getUserIdFromAuthHeader(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            throw new IllegalArgumentException("Missing Authorization header");
        }
        String token = authHeader.replace("Bearer ", "").trim();
        try {
            return Long.parseLong(token);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid Authorization token");
        }
    }
}
