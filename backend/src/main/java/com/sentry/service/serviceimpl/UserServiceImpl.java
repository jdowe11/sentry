package com.sentry.service.serviceimpl;

import com.sentry.dto.UpdateDisplayNameRequest;
import com.sentry.dto.UpdateUsernameRequest;
import com.sentry.model.User;
import com.sentry.repository.UserRepository;
import com.sentry.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        if (user.getUsername().length() > 32) {
            throw new IllegalArgumentException("Username cannot exceed 32 characters");
        }
        if (!user.getUsername().matches("^[a-zA-Z0-9-_]+$")) {
            throw new IllegalArgumentException("Username can only contain alphanumeric characters, hyphens, and underscores");
        }
        if (user.getDisplayName() == null || user.getDisplayName().trim().isEmpty()) {
            throw new IllegalArgumentException("Display name cannot be blank");
        }
        if (user.getDisplayName().length() > 50) {
            throw new IllegalArgumentException("Display name cannot exceed 50 characters");
        }
        if (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
            throw new IllegalArgumentException("Password hash cannot be blank");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be greater than 0");
        }
        if (!(id instanceof Long)) {
            throw new IllegalArgumentException("ID must be a long");
        }
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        if(username.length() > 32) {
            throw new IllegalArgumentException("Username cannot exceed 32 characters");
        }
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be greater than 0");
        }
        if (!(id instanceof Long)) {
            throw new IllegalArgumentException("ID must be a long");
        }
        userRepository.deleteById(id);
    }

    @Override
    public User updateUsername(Long id, UpdateUsernameRequest request) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getNewUsername() == null) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        String newUsername = request.getNewUsername().trim();
        if (newUsername.isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        if (newUsername.length() > 32) {
            throw new IllegalArgumentException("Username cannot exceed 32 characters");
        }
        if (!newUsername.matches("^[a-zA-Z0-9-_]+$")) {
            throw new IllegalArgumentException("Username can only contain alphanumeric characters, hyphens, and underscores");
        }
        if (!existing.getUsername().equals(newUsername)) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new IllegalArgumentException("Username is already taken");
            }
            existing.setUsername(newUsername);
        }

        return userRepository.save(existing);
    }

    @Override
    public User updateDisplayName(Long id, UpdateDisplayNameRequest request) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getNewDisplayName() == null) {
            throw new IllegalArgumentException("Display name cannot be blank");
        }
        String newDisplayName = request.getNewDisplayName().trim();
        if (newDisplayName.isEmpty()) {
            throw new IllegalArgumentException("Display name cannot be blank");
        }
        if (newDisplayName.length() > 50) {
            throw new IllegalArgumentException("Display name cannot exceed 50 characters");
        }
        existing.setDisplayName(newDisplayName);

        return userRepository.save(existing);
    }
}
