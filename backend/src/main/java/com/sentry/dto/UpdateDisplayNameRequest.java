package com.sentry.dto;

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
public class UpdateDisplayNameRequest {
    @NotBlank(message = "Display name cannot be blank")
    @Size(max = 50, message = "Display name cannot exceed 50 characters")
    private String newDisplayName;
}
