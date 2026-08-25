package com.sentry.repository;

import com.sentry.model.Friendship;
import com.sentry.model.User;
import java.util.List;

public interface FriendshipRepository {
    Friendship save(Friendship friendship);
    List<User> findFriendsByUserId(Long userId);
    boolean exists(Long userId1, Long userId2);
    void delete(Long userId1, Long userId2);
}
