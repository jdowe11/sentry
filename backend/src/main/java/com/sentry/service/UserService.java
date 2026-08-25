package com.sentry.service;

import com.sentry.dto.UpdateDisplayNameRequest;
import com.sentry.dto.UpdateUsernameRequest;
import com.sentry.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    List<User> getAllUsers();
    void deleteUser(Long id);
    User updateUsername(Long id, UpdateUsernameRequest request);
    User updateDisplayName(Long id, UpdateDisplayNameRequest request);
    List<User> searchUsers(String query);
}
