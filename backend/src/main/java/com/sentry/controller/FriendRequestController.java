package com.sentry.controller;

import com.sentry.annotation.CurrentUserId;
import com.sentry.dto.FriendRequestResponse;
import com.sentry.dto.SendFriendRequest;
import com.sentry.dto.UpdateStatusRequest;
import com.sentry.model.FriendRequest;
import com.sentry.service.FriendRequestService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0")
@Validated
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/friend-requests")
    public ResponseEntity<FriendRequest> sendFriendRequest(
            @Parameter(hidden = true) @CurrentUserId Long userId,
            @Valid @RequestBody SendFriendRequest request
    ) {
        FriendRequest fr = friendRequestService.sendFriendRequest(userId, request.getReceiverUsername());
        return ResponseEntity.ok(fr);
    }

    @PatchMapping("/friend-requests/{id}/status")
    public ResponseEntity<FriendRequest> updateFriendRequestStatus(
            @Parameter(hidden = true) @CurrentUserId Long userId,
            @PathVariable @Min(1) Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
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
    public ResponseEntity<FriendRequestResponse> getPendingRequests(@Parameter(hidden = true) @CurrentUserId Long userId) {
        FriendRequestResponse response = friendRequestService.getPendingRequests(userId);
        return ResponseEntity.ok(response);
    }
}
