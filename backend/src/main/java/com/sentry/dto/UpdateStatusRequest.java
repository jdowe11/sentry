package com.sentry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    @NotBlank(message = "Status cannot be blank")
    @Pattern(regexp = "^(?i)(accepted|declined|cancelled)$", message = "Invalid status transition. Status must be accepted, declined, or cancelled.")
    private String status;
}
