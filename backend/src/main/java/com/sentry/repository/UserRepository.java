package com.sentry.repository;

import com.sentry.model.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    List<User> findAll();
    boolean existsByUsername(String username);
    void deleteById(Long id);
}
