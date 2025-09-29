package com.library.library_management.controller;

import com.library.library_management.model.User;
import com.library.library_management.model.Role;
import com.library.library_management.dto.UserDTO;
import com.library.library_management.mapper.UserMapper;
import com.library.library_management.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // ✅ Prevent creating ADMIN accounts via API
        if (user.getRole() == Role.ADMIN) {
            return ResponseEntity.status(403)
                    .body("You cannot create ADMIN users through the API. Create them manually in DB.");
        }

        // ✅ (Optional) You can add a check here to see if the current logged-in user is ADMIN
        // Right now, we allow registration unconditionally (except for ADMIN role)
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(UserMapper.toDTO(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> loggedInUser = userService.login(user.getUsername(), user.getPassword());
        if (loggedInUser.isPresent()) {
            return ResponseEntity.ok(UserMapper.toDTO(loggedInUser.get()));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}

