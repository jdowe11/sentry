package com.sentry.friend;

import com.sentry.user.User;
import com.sentry.user.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FriendshipServiceImpl implements FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Friendship addFriendship(Long userId1, Long userId2) {
        if (userId1.equals(userId2)) {
            throw new IllegalArgumentException("Cannot create a friendship with oneself");
        }

        // Verify users exist
        userRepository.findById(userId1)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId1 + " not found"));
        userRepository.findById(userId2)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId2 + " not found"));

        long u1 = Math.min(userId1, userId2);
        long u2 = Math.max(userId1, userId2);

        Friendship friendship = Friendship.builder()
                .userId1(u1)
                .userId2(u2)
                .build();

        return friendshipRepository.save(friendship);
    }

    @Override
    public List<User> getFriendsList(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));

        return friendshipRepository.findFriendsByUserId(userId);
    }

    @Override
    @Transactional
    public void removeFriendship(Long userId, Long friendId) {
        // Verify users exist
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));
        userRepository.findById(friendId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + friendId + " not found"));

        long u1 = Math.min(userId, friendId);
        long u2 = Math.max(userId, friendId);

        if (!friendshipRepository.exists(u1, u2)) {
            throw new IllegalArgumentException("Friendship does not exist");
        }

        // Delete friendship record
        friendshipRepository.delete(u1, u2);

        // Delete corresponding friend request record
        friendRequestRepository.deleteBySenderIdAndReceiverId(userId, friendId);
    }
}
