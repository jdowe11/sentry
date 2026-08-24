package com.sentry.controller;

import com.sentry.dto.FriendRequestResponse;
import com.sentry.dto.SendFriendRequest;
import com.sentry.dto.UpdateStatusRequest;
import com.sentry.model.FriendRequest;
import com.sentry.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.sentry.util.SecurityUtils.getUserIdFromAuthHeader;

@RestController
@RequestMapping("/api/v1.0")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/friend-requests")
    public ResponseEntity<?> sendFriendRequest(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SendFriendRequest request
    ) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            FriendRequest fr = friendRequestService.sendFriendRequest(userId, request.getReceiverUsername());
            return ResponseEntity.ok(fr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/friend-requests/{id}/status")
    public ResponseEntity<?> updateFriendRequestStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request
    ) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            String status = request.getStatus();
            if (status == null) {
                return ResponseEntity.badRequest().body("Status cannot be null");
            }
            status = status.toLowerCase().trim();

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
                    return ResponseEntity.badRequest().body("Invalid status transition. Status must be accepted, declined, or cancelled.");
            }
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/friend-requests/pending")
    public ResponseEntity<?> getPendingRequests(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            FriendRequestResponse response = friendRequestService.getPendingRequests(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
