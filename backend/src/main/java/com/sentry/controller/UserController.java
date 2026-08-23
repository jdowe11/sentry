package com.sentry.controller;

import com.sentry.dto.UpdateDisplayNameRequest;
import com.sentry.dto.UpdateUsernameRequest;
import com.sentry.model.User;
import com.sentry.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0")
public class UserController {

    @Autowired
    private UserService userService;

    /// User Registration
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User created = userService.createUser(user);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /// Retrieve currently authenticated user profile
    @GetMapping("/users/me")
    public ResponseEntity<User> getMe(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            return userService.getUserById(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /// Update currently authenticated user's username
    @PatchMapping("/users/me/username")
    public ResponseEntity<User> updateUsername(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateUsernameRequest request
    ) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            User updated = userService.updateUsername(userId, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /// Update currently authenticated user's display name
    @PatchMapping("/users/me/display-name")
    public ResponseEntity<User> updateDisplayName(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateDisplayNameRequest request
    ) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            User updated = userService.updateDisplayName(userId, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /// Retrieve a user by id
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /// Retrieve a user by username
    @GetMapping("/users/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /// Retrieve all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /// Delete a user by id
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Helper to extract user ID from standard Authorization header
    private Long getUserIdFromAuthHeader(String authHeader) {
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
