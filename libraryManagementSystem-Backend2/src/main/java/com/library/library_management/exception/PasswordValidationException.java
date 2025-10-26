package com.library.library_management.exception;

public class PasswordValidationException extends UserRegistrationException {
  public PasswordValidationException(String message) {
    super(message);
  }

  public PasswordValidationException(String message, Throwable cause) {
    super(message, cause);
  }
}