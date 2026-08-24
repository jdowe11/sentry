package com.sentry.service.serviceimpl;

import com.sentry.dto.FriendRequestResponse;
import com.sentry.model.FriendRequest;
import com.sentry.model.User;
import com.sentry.repository.FriendRequestRepository;
import com.sentry.repository.UserRepository;
import com.sentry.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FriendRequestServiceImpl implements FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public FriendRequest sendFriendRequest(Long senderId, String receiverUsername) {
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new IllegalArgumentException("User with username '" + receiverUsername + "' not found"));

        if (senderId.equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot send a friend request to yourself");
        }

        Optional<FriendRequest> existingRequestOpt = friendRequestRepository.findBySenderAndReceiver(senderId, receiver.getId());

        if (existingRequestOpt.isPresent()) {
            FriendRequest request = existingRequestOpt.get();
            switch (request.getStatus()) {
                case "accepted":
                    throw new IllegalArgumentException("You are already friends with this user");
                case "pending":
                    if (request.getSenderId().equals(senderId)) {
                        throw new IllegalArgumentException("Friend request already sent");
                    } else {
                        throw new IllegalArgumentException("You already have an incoming friend request from this user");
                    }
                case "declined":
                case "cancelled":
                    // Reactivate the request in the correct direction
                    request.setSenderId(senderId);
                    request.setReceiverId(receiver.getId());
                    request.setStatus("pending");
                    return friendRequestRepository.save(request);
                default:
                    throw new IllegalStateException("Unexpected friend request status: " + request.getStatus());
            }
        }

        FriendRequest newRequest = FriendRequest.builder()
                .senderId(senderId)
                .receiverId(receiver.getId())
                .status("pending")
                .build();

        return friendRequestRepository.save(newRequest);
    }

    @Override
    public FriendRequest acceptFriendRequest(Long userId, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!"pending".equals(request.getStatus())) {
            throw new IllegalArgumentException("Friend request is not pending");
        }

        if (!request.getReceiverId().equals(userId)) {
            throw new IllegalArgumentException("Only the receiver can accept a friend request");
        }

        request.setStatus("accepted");
        return friendRequestRepository.save(request);
    }

    @Override
    public FriendRequest declineFriendRequest(Long userId, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!"pending".equals(request.getStatus())) {
            throw new IllegalArgumentException("Friend request is not pending");
        }

        if (!request.getReceiverId().equals(userId)) {
            throw new IllegalArgumentException("Only the receiver can decline a friend request");
        }

        request.setStatus("declined");
        return friendRequestRepository.save(request);
    }

    @Override
    public FriendRequest cancelFriendRequest(Long userId, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!"pending".equals(request.getStatus())) {
            throw new IllegalArgumentException("Friend request is not pending");
        }

        if (!request.getSenderId().equals(userId)) {
            throw new IllegalArgumentException("Only the sender can cancel a friend request");
        }

        request.setStatus("cancelled");
        return friendRequestRepository.save(request);
    }

    @Override
    public FriendRequestResponse getPendingRequests(Long userId) {
        List<FriendRequest> pending = friendRequestRepository.findPendingByUserId(userId);
        List<FriendRequest> incoming = new ArrayList<>();
        List<FriendRequest> outgoing = new ArrayList<>();

        for (FriendRequest request : pending) {
            if (request.getReceiverId().equals(userId)) {
                incoming.add(request);
            } else if (request.getSenderId().equals(userId)) {
                outgoing.add(request);
            }
        }

        return FriendRequestResponse.builder()
                .incoming(incoming)
                .outgoing(outgoing)
                .build();
    }
}
