package com.library.library_management.service;

import com.library.library_management.exception.PasswordValidationException;
import com.library.library_management.exception.UserRegistrationException;
import com.library.library_management.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserValidationService {

    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 128;

    public void validateUserRegistration(User user) {
        //  Convert empty email ("") to null to avoid duplicate '' constraint issues
        if (user.getEmail() != null && user.getEmail().trim().isEmpty()) {
            user.setEmail(null);
        }

        validateUsername(user.getUsername());
        validatePassword(user.getPassword());
        validateEmail(user.getEmail()); // now optional
        validateName(user.getFirstName(), "First name");
        validateName(user.getLastName(), "Last name");
    }

    private void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new UserRegistrationException("Username is required");
        }

        if (username.length() < 3 || username.length() > 50) {
            throw new UserRegistrationException("Username must be between 3 and 50 characters");
        }

        if (!username.matches("^[a-zA-Z0-9._-]+$")) {
            throw new UserRegistrationException("Username can only contain letters, numbers, dots, hyphens, and underscores");
        }
    }

    public void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new PasswordValidationException("Password is required");
        }

        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new PasswordValidationException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long");
        }

        if (password.length() > MAX_PASSWORD_LENGTH) {
            throw new PasswordValidationException("Password cannot exceed " + MAX_PASSWORD_LENGTH + " characters");
        }
    }

    private void validateEmail(String email) {
        // ✅ Email is optional
        if (email == null || email.trim().isEmpty()) {
            return;
        }

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!email.matches(emailRegex)) {
            throw new UserRegistrationException("Invalid email format");
        }
    }

    private void validateName(String name, String fieldName) {
        if (name == null || name.trim().isEmpty()) {
            throw new UserRegistrationException(fieldName + " is required");
        }

        if (name.length() < 2 || name.length() > 50) {
            throw new UserRegistrationException(fieldName + " must be between 2 and 50 characters");
        }

        if (!name.matches("^[a-zA-Z\\s'-]+$")) {
            throw new UserRegistrationException(fieldName + " can only contain letters, spaces, hyphens, and apostrophes");
        }
    }

    public void validatePasswordStrength(String password) {
        validatePassword(password);

        if (password.length() < 12) {
            throw new PasswordValidationException("For stronger security, use at least 12 characters");
        }

        if (hasSequentialCharacters(password)) {
            throw new PasswordValidationException("Password contains sequential characters which are easy to guess");
        }
    }

    private boolean hasSequentialCharacters(String password) {
        String lowerPassword = password.toLowerCase();
        String sequentialPatterns = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (int i = 0; i < lowerPassword.length() - 2; i++) {
            String sequence = lowerPassword.substring(i, i + 3);
            if (sequentialPatterns.contains(sequence)) {
                return true;
            }
        }
        return false;
    }
}
