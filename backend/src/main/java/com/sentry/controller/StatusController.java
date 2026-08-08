package com.sentry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StatusController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Sentry Backend Boilerplate");

        try {
            // Run a simple test query to verify database connection is active
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                status.put("database", "CONNECTED");
            } else {
                status.put("database", "UNEXPECTED_RESPONSE");
            }
        } catch (Exception e) {
            status.put("database", "DISCONNECTED");
            status.put("database_error", e.getMessage());
        }

        return ResponseEntity.ok(status);
    }
}
