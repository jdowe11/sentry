package com.sentry.service;

import com.sentry.model.User;

public interface AuthService {
    User login(String username, String password);
}
