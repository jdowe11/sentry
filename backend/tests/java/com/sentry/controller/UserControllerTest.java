package com.sentry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentry.model.User;
import com.sentry.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    // ==========================================
    // createUser Endpoint Tests
    // ==========================================

    @Test
    public void testCreateUser_Success() throws Exception {
        User inputUser = User.builder()
                .username("newguy")
                .displayName("New Guy")
                .passwordHash("hashed")
                .build();

        User savedUser = User.builder()
                .id(5L)
                .username("newguy")
                .displayName("New Guy")
                .passwordHash("hashed")
                .createdAt(LocalDateTime.now())
                .build();

        when(userService.createUser(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/v1.0/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.username").value("newguy"));
    }

    @Test
    public void testCreateUser_Failure_BadRequest() throws Exception {
        User inputUser = User.builder().username("").displayName("").build();

        when(userService.createUser(any(User.class))).thenThrow(new IllegalArgumentException("Invalid input"));

        mockMvc.perform(post("/api/v1.0/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputUser)))
                .andExpect(status().isBadRequest());
    }

    // ==========================================
    // getUserById Endpoint Tests
    // ==========================================

    @Test
    public void testGetUserById_Found() throws Exception {
        User user = User.builder()
                .id(1L)
                .username("gamer123")
                .displayName("CoolGamer")
                .passwordHash("hash")
                .createdAt(LocalDateTime.now())
                .build();

        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/v1.0/user/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("gamer123"))
                .andExpect(jsonPath("$.displayName").value("CoolGamer"));
    }

    @Test
    public void testGetUserById_NotFound() throws Exception {
        when(userService.getUserById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1.0/user/99")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // ==========================================
    // getUserByUsername Endpoint Tests
    // ==========================================

    @Test
    public void testGetUserByUsername_Found() throws Exception {
        User user = User.builder()
                .id(2L)
                .username("findme")
                .displayName("Find Me")
                .build();

        when(userService.getUserByUsername("findme")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/v1.0/user/username/findme"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.username").value("findme"));
    }

    @Test
    public void testGetUserByUsername_NotFound() throws Exception {
        when(userService.getUserByUsername("missing")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1.0/user/username/missing"))
                .andExpect(status().isNotFound());
    }

    // ==========================================
    // getAllUsers Endpoint Tests
    // ==========================================

    @Test
    public void testGetAllUsers_Success() throws Exception {
        User u1 = User.builder().id(10L).username("user10").build();
        User u2 = User.builder().id(11L).username("user11").build();

        when(userService.getAllUsers()).thenReturn(Arrays.asList(u1, u2));

        mockMvc.perform(get("/api/v1.0/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("user10"))
                .andExpect(jsonPath("$[1].username").value("user11"));
    }

    // ==========================================
    // deleteUser Endpoint Tests
    // ==========================================

    @Test
    public void testDeleteUser_Success() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/v1.0/user/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteUser_Failure_BadRequest() throws Exception {
        doThrow(new IllegalArgumentException("Invalid ID")).when(userService).deleteUser(-1L);

        mockMvc.perform(delete("/api/v1.0/user/-1"))
                .andExpect(status().isBadRequest());
    }
}
