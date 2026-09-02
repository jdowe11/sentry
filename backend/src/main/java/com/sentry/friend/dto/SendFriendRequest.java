package com.sentry.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendFriendRequest {
    @NotBlank(message = "Receiver username cannot be blank")
    @Size(min = 3, max = 32, message = "Receiver username length must be between 3 and 32 characters")
    private String receiverUsername;
}
