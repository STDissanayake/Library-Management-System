package com.library.library_management.service;

import com.library.library_management.model.User;
import com.library.library_management.model.Role;
import com.library.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Register new user
    public User registerUser(User user) {
        // Default role if none provided
        if (user.getRole() == null) {
            user.setRole(Role.STAFF);
        }
        return userRepository.save(user);
    }

    // ✅ Find by username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // ✅ Login check
    public Optional<User> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password)); // later add password hashing
    }
}
