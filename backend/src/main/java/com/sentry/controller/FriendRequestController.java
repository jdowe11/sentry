package com.sentry.controller;

import com.sentry.dto.FriendRequestResponse;
import com.sentry.dto.SendFriendRequest;
import com.sentry.dto.UpdateStatusRequest;
import com.sentry.model.FriendRequest;
import com.sentry.service.FriendRequestService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import static com.sentry.util.SecurityUtils.getUserIdFromAuthHeader;

@RestController
@RequestMapping("/api/v1.0")
@Validated
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/friend-requests")
    public ResponseEntity<FriendRequest> sendFriendRequest(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody SendFriendRequest request
    ) {
        Long userId = getUserIdFromAuthHeader(authHeader);
        FriendRequest fr = friendRequestService.sendFriendRequest(userId, request.getReceiverUsername());
        return ResponseEntity.ok(fr);
    }

    @PatchMapping("/friend-requests/{id}/status")
    public ResponseEntity<FriendRequest> updateFriendRequestStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable @Min(1) Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        Long userId = getUserIdFromAuthHeader(authHeader);
        String status = request.getStatus().toLowerCase().trim();

        FriendRequest updated;
        switch (status) {
            case "accepted":
                updated = friendRequestService.acceptFriendRequest(userId, id);
                break;
            case "declined":
                updated = friendRequestService.declineFriendRequest(userId, id);
                break;
            case "cancelled":
                updated = friendRequestService.cancelFriendRequest(userId, id);
                break;
            default:
                throw new IllegalArgumentException("Invalid status transition");
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/friend-requests/pending")
    public ResponseEntity<FriendRequestResponse> getPendingRequests(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromAuthHeader(authHeader);
        FriendRequestResponse response = friendRequestService.getPendingRequests(userId);
        return ResponseEntity.ok(response);
    }
}
