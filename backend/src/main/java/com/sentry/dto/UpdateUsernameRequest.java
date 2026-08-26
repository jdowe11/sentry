package com.sentry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUsernameRequest {
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 32, message = "Username cannot exceed 32 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Username can only contain alphanumeric characters, hyphens, and underscores")
    private String newUsername;
}
