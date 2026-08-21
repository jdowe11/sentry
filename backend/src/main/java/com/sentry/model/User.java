package com.sentry.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String username;
    private String displayName;
    private String passwordHash;
    private LocalDateTime createdAt;
}
