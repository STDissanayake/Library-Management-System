package com.library.library_management.mapper;

import com.library.library_management.dto.UserDTO;
import com.library.library_management.model.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setStatus(user.getStatus()); // ✅ ADD THIS LINE - crucial!

        return dto;
    }
}