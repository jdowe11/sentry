package com.sentry.dto;

import com.sentry.model.FriendRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestResponse {
    private List<FriendRequest> incoming;
    private List<FriendRequest> outgoing;
}
