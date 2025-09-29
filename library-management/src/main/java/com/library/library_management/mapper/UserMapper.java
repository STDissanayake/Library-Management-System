package com.library.library_management.mapper;

import com.library.library_management.dto.UserDTO;
import com.library.library_management.model.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null) return null;
        return new UserDTO(user.getId(), user.getUsername(), user.getRole());
    }
}
