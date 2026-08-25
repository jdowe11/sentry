package com.sentry.controller;

import com.sentry.model.User;
import com.sentry.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sentry.util.SecurityUtils.getUserIdFromAuthHeader;

@RestController
@RequestMapping("/api/v1.0")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @GetMapping("/friends")
    public ResponseEntity<List<User>> getFriendsList(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            List<User> friends = friendshipService.getFriendsList(userId);
            return ResponseEntity.ok(friends);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/friends/{friendId}")
    public ResponseEntity<Void> removeFriend(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long friendId) {
        try {
            Long userId = getUserIdFromAuthHeader(authHeader);
            friendshipService.removeFriendship(userId, friendId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
