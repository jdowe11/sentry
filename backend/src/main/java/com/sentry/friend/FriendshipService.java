package com.sentry.friend;

import com.sentry.user.User;

import java.util.List;

public interface FriendshipService {
    Friendship addFriendship(Long userId1, Long userId2);
    /// Never called on friendship endpoint, called by FriendRequestService to update a new friendship when adding a friend.
    List<User> getFriendsList(Long userId);
    void removeFriendship(Long userId, Long friendId);
}
