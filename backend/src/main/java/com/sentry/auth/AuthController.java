package com.sentry.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentry.auth.dto.LoginRequest;
import com.sentry.user.User;

@RestController
@RequestMapping("/api/v1.0")
public class AuthController {

    @Autowired
    private AuthService authService;

    /// User Authentication (Login)
    @PostMapping("/auth/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /// User Logout
    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
