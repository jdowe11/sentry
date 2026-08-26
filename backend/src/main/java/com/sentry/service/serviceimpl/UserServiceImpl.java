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
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        return userRepository.findByUsername(username.trim());
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
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

        String newUsername = request.getNewUsername().trim();
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

        String newDisplayName = request.getNewDisplayName().trim();
        existing.setDisplayName(newDisplayName);

        return userRepository.save(existing);
    }

    @Override
    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return userRepository.searchByUsername(query.trim());
    }
}
