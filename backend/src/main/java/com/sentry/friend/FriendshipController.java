package com.sentry.friend;

import com.sentry.common.annotation.CurrentUserId;
import com.sentry.user.User;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0")
@Validated
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @GetMapping("/friends")
    public ResponseEntity<List<User>> getFriendsList(@Parameter(hidden = true) @CurrentUserId Long userId) {
        List<User> friends = friendshipService.getFriendsList(userId);
        return ResponseEntity.ok(friends);
    }

    @DeleteMapping("/friends/{friendId}")
    public ResponseEntity<Void> removeFriend(
            @Parameter(hidden = true) @CurrentUserId Long userId,
            @PathVariable @Min(1) Long friendId) {
        friendshipService.removeFriendship(userId, friendId);
        return ResponseEntity.ok().build();
    }
}
