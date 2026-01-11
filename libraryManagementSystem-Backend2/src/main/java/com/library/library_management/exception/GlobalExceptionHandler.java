package com.library.library_management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler for User Management in Library Management System
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==================== USER MANAGEMENT EXCEPTIONS ====================
    @ExceptionHandler(UserRegistrationException.class)
    public ResponseEntity<Object> handleUserRegistrationException(UserRegistrationException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordValidationException.class)
    public ResponseEntity<Object> handlePasswordValidationException(PasswordValidationException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST, request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI());
    }

    // ==================== HELPER METHOD ====================
    private ResponseEntity<Object> buildErrorResponse(String message, HttpStatus status) {
        return buildErrorResponse(message, status, "User Management API");
    }

    private ResponseEntity<Object> buildErrorResponse(String message, HttpStatus status, String path) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", path);

        return new ResponseEntity<>(body, status);
    }
}