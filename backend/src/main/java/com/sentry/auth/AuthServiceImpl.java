package com.sentry.auth;

import com.sentry.user.User;
import com.sentry.user.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User login(String username, String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Username and password cannot be blank");
        }
        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // Temporary plain text comparison (will update when password hashing is introduced)
        if (!user.getPasswordHash().equals(password)) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user;
    }
}
