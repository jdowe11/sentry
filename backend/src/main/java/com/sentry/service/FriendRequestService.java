package com.sentry.service;

import com.sentry.dto.FriendRequestResponse;
import com.sentry.model.FriendRequest;

public interface FriendRequestService {
    FriendRequest sendFriendRequest(Long senderId, String receiverUsername);
    FriendRequest acceptFriendRequest(Long userId, Long requestId);
    FriendRequest declineFriendRequest(Long userId, Long requestId);
    FriendRequest cancelFriendRequest(Long userId, Long requestId);
    FriendRequestResponse getPendingRequests(Long userId);
}
