package com.library.library_management.config;

import com.library.library_management.model.Role;
import com.library.library_management.model.Member;
import com.library.library_management.model.User;
import com.library.library_management.model.UserStatus;
import com.library.library_management.repository.MemberRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

@Configuration
public class DemoUserSeeder {

    @Bean
    @Order(10)
    public CommandLineRunner seedDemoUsers(UserRepository userRepository, MemberRepository memberRepository) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            createIfMissing(userRepository, encoder,
                    "admin",
                    "admin123",
                    Role.ADMIN,
                    "admin@library.com",
                    "0770000001",
                    "Admin",
                    "User");

            createIfMissing(userRepository, encoder,
                    "librarian",
                    "librarian123",
                    Role.LIBRARIAN,
                    "librarian@library.com",
                    "0770000002",
                    "Librarian",
                    "Staff");

            createIfMissing(userRepository, encoder,
                    "member1",
                    "member1123",
                    Role.STAFF,
                    "member1@library.com",
                    "0770000003",
                    "Member",
                    "One");

            // Backfill: if demo users already exist but phone is missing, update them
            backfillUserPhone(userRepository, "admin", "0770000001");
            backfillUserPhone(userRepository, "librarian", "0770000002");
            backfillUserPhone(userRepository, "member1", "0770000003");

            // Backfill: if members exist with null registrationDate (older data), set it
            backfillMemberRegistrationDates(memberRepository);
        };
    }

    private void backfillUserPhone(UserRepository userRepository, String username, String phone) {
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isEmpty()) {
            return;
        }

        User user = existing.get();
        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            user.setPhone(phone);
            userRepository.save(user);
        }
    }

    private void backfillMemberRegistrationDates(MemberRepository memberRepository) {
        for (Member member : memberRepository.findAll()) {
            if (member.getRegistrationDate() == null) {
                member.setRegistrationDate(LocalDateTime.now());
                memberRepository.save(member);
            }
        }
    }

    private void createIfMissing(
            UserRepository userRepository,
            BCryptPasswordEncoder encoder,
            String username,
            String rawPassword,
            Role role,
            String email,
            String phone,
            String firstName,
            String lastName
    ) {
        Optional<User> existingOpt = userRepository.findByUsername(username);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();

            boolean needsUpdate = false;
            if (existing.getPassword() == null || !encoder.matches(rawPassword, existing.getPassword())) {
                existing.setPassword(encoder.encode(rawPassword));
                needsUpdate = true;
            }
            if (existing.getRole() != role) {
                existing.setRole(role);
                needsUpdate = true;
            }
            if (existing.getStatus() != UserStatus.ACTIVE) {
                existing.setStatus(UserStatus.ACTIVE);
                needsUpdate = true;
            }
            if (existing.getEmail() == null || !existing.getEmail().equals(email)) {
                existing.setEmail(email);
                needsUpdate = true;
            }
            if (existing.getPhone() == null || existing.getPhone().trim().isEmpty() || !existing.getPhone().equals(phone)) {
                existing.setPhone(phone);
                needsUpdate = true;
            }
            if (existing.getFirstName() == null || !existing.getFirstName().equals(firstName)) {
                existing.setFirstName(firstName);
                needsUpdate = true;
            }
            if (existing.getLastName() == null || !existing.getLastName().equals(lastName)) {
                existing.setLastName(lastName);
                needsUpdate = true;
            }
            if (existing.getCreatedAt() == null) {
                existing.setCreatedAt(LocalDateTime.now());
                needsUpdate = true;
            }

            if (needsUpdate) {
                userRepository.save(existing);
            }
            return;
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(rawPassword));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setEmail(email);
        user.setPhone(phone);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
    }
}
