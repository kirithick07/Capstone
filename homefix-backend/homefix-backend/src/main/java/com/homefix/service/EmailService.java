package com.homefix.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void sendEmail(
            String to,
            String subject,
            String text) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(System.getenv("MAIL_USERNAME"));
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send email through Gmail SMTP",
                    e
            );
        }
    }

    // =========================================
    // REGISTRATION VERIFICATION EMAIL
    // =========================================

    public void sendVerificationCode(
            String email,
            String code) {

        sendEmail(
                email,
                "HomeFix - Email Verification",
                "Welcome to HomeFix!\n\n"
                + "Your email verification code is:\n\n"
                + code
                + "\n\n"
                + "This code is valid for 10 minutes.\n\n"
                + "Thank you,\n"
                + "HomeFix Team"
        );
    }

    // =========================================
    // LOGIN NOTIFICATION EMAIL
    // =========================================

    public void sendLoginNotification(
            String email) {

        sendEmail(
                email,
                "HomeFix - Login Notification",
                "Hello,\n\n"
                + "Your HomeFix account was successfully "
                + "logged in.\n\n"
                + "If this was not you, please change "
                + "your password immediately.\n\n"
                + "HomeFix Team"
        );
    }

    // =========================================
    // PASSWORD RESET EMAIL
    // =========================================

    public void sendPasswordResetEmail(
            String email,
            String resetLink) {

        sendEmail(
                email,
                "HomeFix - Password Reset",
                "Hello,\n\n"
                + "We received a request to reset your "
                + "HomeFix password.\n\n"
                + "Click the link below to create a new password:\n\n"
                + resetLink
                + "\n\n"
                + "This password reset link will expire soon.\n\n"
                + "If you did not request this email, "
                + "please ignore it.\n\n"
                + "Thank you,\n"
                + "HomeFix Team"
        );
    }
}