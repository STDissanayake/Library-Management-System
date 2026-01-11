package com.library.library_management.dto;

import com.library.library_management.model.Role;
import com.library.library_management.model.UserStatus;
import java.time.LocalDateTime;

public class UserDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String username;
    private Role role;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private UserStatus status;

    //  Default constructor
    public UserDTO() {}

    //  Constructor for basic fields
    public UserDTO(Long userId, String firstName, String lastName, String username, Role role) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.role = role;
    }

    // ===== Getters & Setters =====
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}