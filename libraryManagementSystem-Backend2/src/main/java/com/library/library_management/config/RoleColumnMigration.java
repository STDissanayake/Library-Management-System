package com.library.library_management.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ensures the database schema supports the current Role enum values.
 *
 * This project historically created users.role as ENUM('ADMIN','STAFF').
 * When adding new role values (e.g. LIBRARIAN), MySQL must be altered to accept them.
 */
@Component
@Order(0)
public class RoleColumnMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public RoleColumnMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            String columnType = jdbcTemplate.queryForObject(
                    "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS " +
                            "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
                    String.class
            );

            if (columnType == null) {
                return;
            }

            // If role is already a varchar (or any non-enum) or already includes LIBRARIAN, do nothing.
            String upper = columnType.toUpperCase();
            if (!upper.startsWith("ENUM(") || upper.contains("LIBRARIAN")) {
                return;
            }

            // Expand enum to include LIBRARIAN.
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN','STAFF','LIBRARIAN') NOT NULL");
        } catch (Exception ex) {
            // Fail fast so the cause is obvious; without this migration, the application cannot persist LIBRARIAN.
            throw new IllegalStateException(
                    "Failed to auto-migrate users.role column to include LIBRARIAN. " +
                            "Please ensure the database user has ALTER privileges and restart.",
                    ex
            );
        }
    }
}
