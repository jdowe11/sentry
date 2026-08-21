package com.sentry.service.serviceimpl;

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
}
