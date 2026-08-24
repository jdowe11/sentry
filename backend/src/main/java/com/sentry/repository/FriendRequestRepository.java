package com.sentry.repository;

import com.sentry.model.FriendRequest;
import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository {
    FriendRequest save(FriendRequest request);
    Optional<FriendRequest> findById(Long id);
    Optional<FriendRequest> findBySenderAndReceiver(Long senderId, Long receiverId);
    List<FriendRequest> findPendingByUserId(Long userId);
    void deleteById(Long id);
}
