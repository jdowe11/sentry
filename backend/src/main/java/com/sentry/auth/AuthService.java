package com.sentry.auth;

import com.sentry.user.User;

public interface AuthService {
    User login(String username, String password);
}
