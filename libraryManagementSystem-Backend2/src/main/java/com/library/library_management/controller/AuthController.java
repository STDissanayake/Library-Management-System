package com.library.library_management.controller;

import com.library.library_management.model.User;
import com.library.library_management.model.Role;
import com.library.library_management.model.UserStatus;
import com.library.library_management.dto.UserDTO;
import com.library.library_management.mapper.UserMapper;
import com.library.library_management.service.EmailService;
import com.library.library_management.service.UserService;
import com.library.library_management.service.UserValidationService;
import com.library.library_management.exception.UserRegistrationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserValidationService userValidationService;
    private final EmailService emailService;

    public AuthController(UserService userService, UserValidationService userValidationService, EmailService emailService) {
        this.userService = userService;
        this.userValidationService = userValidationService;
        this.emailService = emailService;
    }

    // ✅ Simple registration endpoint (no admin required for demo)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            String rawPassword = user.getPassword();

            // ⚠️ Check if username already exists
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(400).body("Username already taken");
            }

            // ✅ Validate user registration data
            userValidationService.validateUserRegistration(user);

            user.setCreatedAt(LocalDateTime.now());
            // ✅ Default role to STAFF if not specified
            if (user.getRole() == null) {
                user.setRole(Role.STAFF);
            }

            // ✅ Default status to ACTIVE for new registrations
            if (user.getStatus() == null) {
                user.setStatus(UserStatus.ACTIVE);
            }

            // ✅ Save user and return DTO
            User savedUser = userService.registerUser(user);

            // Best-effort: send email with credentials (only if SMTP configured)
            emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getUsername(), rawPassword);
            return ResponseEntity.ok(UserMapper.toDTO(savedUser));

        } catch (UserRegistrationException ex) {
            return ResponseEntity.status(400).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(400).body("Registration failed: " + ex.getMessage());
        }
    }

    // ✅ Admin-only registration (simple version: uses header X-Role)
    @PostMapping("/admin-register")
    public ResponseEntity<?> adminRegister(
            @RequestHeader(value = "X-Role", required = false) String roleHeader,
            @RequestBody User user) {

        try {
            // 🔒 Allow only Admins to create users
            if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
                return ResponseEntity.status(403).body("Access denied. Only admins can register users.");
            }

            // ❌ Prevent creating ADMIN accounts via API
            if (user.getRole() == Role.ADMIN) {
                return ResponseEntity.status(403)
                        .body("You cannot create ADMIN users through the API. Create them manually in DB.");
            }

            // ⚠️ Check if username already exists
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                throw new UserRegistrationException("Username already taken");
            }

            // ✅ Validate user registration data
            userValidationService.validateUserRegistration(user);

            user.setCreatedAt(LocalDateTime.now());
            // ✅ Default role to STAFF if not specified
            if (user.getRole() == null) {
                user.setRole(Role.STAFF);
            }

            // ✅ Default status to ACTIVE for new registrations
            if (user.getStatus() == null) {
                user.setStatus(UserStatus.ACTIVE);
            }

            // ✅ Save user and return DTO
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(UserMapper.toDTO(savedUser));

        } catch (UserRegistrationException ex) {
            // Let the GlobalExceptionHandler handle this
            throw ex;
        } catch (Exception ex) {
            throw new UserRegistrationException("Registration failed: " + ex.getMessage());
        }
    }

    // ✅ Login with status check
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> loggedInUser = userService.login(user.getUsername(), user.getPassword());

        if (loggedInUser.isPresent()) {
            User foundUser = loggedInUser.get();

            // 🔒 Check if user account is active
            if (foundUser.getStatus() == UserStatus.INACTIVE) {
                return ResponseEntity.status(401)
                        .body("Your account has been deactivated. Please contact administrator.");
            }

            return ResponseEntity.ok(UserMapper.toDTO(foundUser));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    // ✅ NEW: Get all users (for Admin Dashboard)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestHeader(value = "X-Role", required = false) String roleHeader) {

        // Allow only Admins to view all users
        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied. Only admins can view users.");
        }

        List<UserDTO> users = userService.findAll().stream()
                .map(UserMapper::toDTO)
                .toList();

        return ResponseEntity.ok(users);
    }

    // ✅ NEW: Update user status (Activate/Deactivate)
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @RequestHeader(value = "X-Role", required = false) String roleHeader,
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {

        // Allow only Admins to update user status
        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied. Only admins can update user status.");
        }

        try {
            String statusStr = request.get("status");
            if (statusStr == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            UserStatus newStatus = UserStatus.valueOf(statusStr.toUpperCase());

            // Prevent admin from deactivating their own account
            Optional<User> currentAdmin = userService.findById(userId);
            if (currentAdmin.isPresent() && currentAdmin.get().getRole() == Role.ADMIN) {
                // You might want to add additional logic to prevent self-deactivation
                // This would require knowing which admin is making the request
            }

            userService.updateUserStatus(userId, newStatus);
            return ResponseEntity.ok().body("User status updated successfully to " + newStatus);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value. Use 'ACTIVE' or 'INACTIVE'");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating user status: " + e.getMessage());
        }
    }

    // ✅ NEW: Get user by ID (for admin operations)
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(
            @RequestHeader(value = "X-Role", required = false) String roleHeader,
            @PathVariable Long userId) {

        // Allow only Admins to view user details
        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied. Only admins can view user details.");
        }

        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(UserMapper.toDTO(user.get()));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @RequestHeader(value = "X-Role", required = false) String roleHeader,
            @PathVariable Long userId,
            @RequestBody User user) {

        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied. Only admins can update users.");
        }

        User updated = userService.updateUser(userId, user);
        if (updated == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(UserMapper.toDTO(updated));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader(value = "X-Role", required = false) String roleHeader,
            @PathVariable Long userId) {

        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied. Only admins can delete users.");
        }

        boolean deleted = userService.deleteUser(userId);
        if (!deleted) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok().body("User deleted successfully");
    }

    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestHeader(value = "X-Role", required = false) String roleHeader,
            @PathVariable Long userId) {

        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied. Only admins can reset passwords.");
        }

        String tempPassword = userService.resetPassword(userId);
        if (tempPassword == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(Map.of("temporaryPassword", tempPassword));
    }

    // ✅ Validate password strength (for frontend integration)
    @PostMapping("/validate-password")
    public ResponseEntity<?> validatePassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        try {
            userValidationService.validatePassword(password);
            return ResponseEntity.ok(Map.of("valid", true, "message", "Password meets requirements"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("valid", false, "message", ex.getMessage()));
        }
    }
}