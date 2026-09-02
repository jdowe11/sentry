package com.sentry.user;

import com.sentry.common.annotation.CurrentUserId;
import com.sentry.user.dto.UpdateDisplayNameRequest;
import com.sentry.user.dto.UpdateUsernameRequest;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    /// User Registration
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.ok(created);
    }

    /// Retrieve currently authenticated user profile
    @GetMapping("/users/me")
    public ResponseEntity<User> getMe(@Parameter(hidden = true) @CurrentUserId Long userId) {
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /// Update currently authenticated user's username
    @PatchMapping("/users/me/username")
    public ResponseEntity<User> updateUsername(
            @Parameter(hidden = true) @CurrentUserId Long userId,
            @Valid @RequestBody UpdateUsernameRequest request
    ) {
        User updated = userService.updateUsername(userId, request);
        return ResponseEntity.ok(updated);
    }

    /// Update currently authenticated user's display name
    @PatchMapping("/users/me/display-name")
    public ResponseEntity<User> updateDisplayName(
            @Parameter(hidden = true) @CurrentUserId Long userId,
            @Valid @RequestBody UpdateDisplayNameRequest request
    ) {
        User updated = userService.updateDisplayName(userId, request);
        return ResponseEntity.ok(updated);
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
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /// Search users by query
    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(userService.searchUsers(query.trim()));
    }
}
