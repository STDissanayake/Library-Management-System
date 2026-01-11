package com.library.library_management.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.mail.from:no-reply@library.local}")
    private String fromAddress;

    @Value("${spring.mail.host:}")
    private String mailHost;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public void sendRegistrationEmail(String toEmail, String username, String rawPassword) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            System.out.println("Email not sent (JavaMailSender not configured). Recipient: " + toEmail);
            return;
        }

        if (mailHost == null || mailHost.trim().isEmpty()) {
            System.out.println("Email not sent (spring.mail.host not configured). Recipient: " + toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("Library Account Registration");
            message.setText(
                    "Your library account has been created.\n\n" +
                    "Username: " + username + "\n" +
                    "Password: " + rawPassword + "\n\n" +
                    "Please keep this information safe."
            );

            mailSender.send(message);
        } catch (Exception ex) {
            System.out.println("Failed to send registration email to " + toEmail + ": " + ex.getMessage());
        }
    }
}
