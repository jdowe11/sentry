package com.sentry.controller;

import com.sentry.model.User;
import com.sentry.service.FriendshipService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sentry.util.SecurityUtils.getUserIdFromAuthHeader;

@RestController
@RequestMapping("/api/v1.0")
@Validated
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @GetMapping("/friends")
    public ResponseEntity<List<User>> getFriendsList(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromAuthHeader(authHeader);
        List<User> friends = friendshipService.getFriendsList(userId);
        return ResponseEntity.ok(friends);
    }

    @DeleteMapping("/friends/{friendId}")
    public ResponseEntity<Void> removeFriend(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable @Min(1) Long friendId) {
        Long userId = getUserIdFromAuthHeader(authHeader);
        friendshipService.removeFriendship(userId, friendId);
        return ResponseEntity.ok().build();
    }
}
