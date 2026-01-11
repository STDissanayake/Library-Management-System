package com.library.library_management.service;

import com.library.library_management.model.Role;
import com.library.library_management.model.User;
import com.library.library_management.model.UserStatus;
import com.library.library_management.repository.UserRepository;
import com.library.library_management.exception.UserRegistrationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserValidationService userValidationService;

    public UserService(UserRepository userRepository, UserValidationService userValidationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.userValidationService = userValidationService;
    }

    // ✅ Register new user
    public User registerUser(User user) {
        try {
            if (user.getRole() == null) {
                user.setRole(Role.STAFF); // default role
            }
            // ✅ Default status to ACTIVE for new registrations
            if (user.getStatus() == null) {
                user.setStatus(UserStatus.ACTIVE);
            }
            user.setPassword(passwordEncoder.encode(user.getPassword())); // ✅ Encrypt before saving
            return userRepository.save(user);
        } catch (Exception ex) {
            throw new UserRegistrationException("Failed to register user: " + ex.getMessage());
        }
    }

    // ✅ Find by username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Find by ID
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    // Login with status check
    public Optional<User> login(String username, String password) {
        System.out.println("Login attempt - identifier: " + username);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() && username != null && username.contains("@")) {
            userOpt = userRepository.findByEmail(username);
        }
        if (userOpt.isEmpty()) {
            System.out.println(" No user found with identifier: " + username);
            return Optional.empty();
        }

        User user = userOpt.get();

        // Check if user account is active
        if (user.getStatus() == UserStatus.INACTIVE) {
            System.out.println(" User account is inactive: " + username);
            throw new RuntimeException("Your account has been deactivated. Please contact administrator.");
        }

        boolean match = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password match result: " + match);

        return match ? Optional.of(user) : Optional.empty();
    }

    // NEW: Update user status
    public void updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        user.setStatus(status);
        userRepository.save(user);
        System.out.println("✅ User status updated - ID: " + userId + ", Status: " + status);
    }

    // ✅ NEW: Validate user status (for use in authentication)
    public void validateUserStatus(User user) {
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("Your account has been deactivated. Please contact administrator.");
        }
    }

    // NEW: Fetch all users (for Admin Dashboard)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // NEW: Change password with validation
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }

        // Validate new password
        userValidationService.validatePassword(newPassword);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    // NEW: Get all users for admin management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // NEW: Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // NEW: Update user
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return null;
        }

        // Update allowed fields
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        existingUser.setRole(user.getRole());
        if (user.getStatus() != null) {
            existingUser.setStatus(user.getStatus());
        }
        
        return userRepository.save(existingUser);
    }

    // NEW: Delete user
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // NEW: Update user status
    public User updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }

        try {
            UserStatus newStatus = UserStatus.valueOf(status.toUpperCase());
            user.setStatus(newStatus);
            return userRepository.save(user);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    // NEW: Reset password
    public String resetPassword(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }

        // Generate temporary password
        String tempPassword = "Temp" + System.currentTimeMillis() % 10000;
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        return tempPassword;
    }
}