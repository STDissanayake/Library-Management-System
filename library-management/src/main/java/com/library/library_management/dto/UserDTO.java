package com.library.library_management.dto;

import com.library.library_management.model.Role;

public class UserDTO {
    private Long id;
    private String username;
    private Role role;

    // No-args constructor (important for JSON deserialization)
    public UserDTO() {
    }

    // All-args constructor
    public UserDTO(Long id, String username, Role role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", role=" + role +
                '}';
    }
}
