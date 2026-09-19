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

    // =========================================
    // REGISTRATION VERIFICATION EMAIL
    // =========================================

    public void sendVerificationCode(
            String email,
            String code) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "HomeFix - Email Verification"
        );

        message.setText(
                "Welcome to HomeFix!\n\n"
                + "Your email verification code is:\n\n"
                + code
                + "\n\n"
                + "This code is valid for 10 minutes.\n\n"
                + "Thank you,\n"
                + "HomeFix Team"
        );

        mailSender.send(message);
    }


    // =========================================
    // LOGIN NOTIFICATION EMAIL
    // =========================================

    public void sendLoginNotification(
            String email) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "HomeFix - Login Notification"
        );

        message.setText(
                "Hello,\n\n"
                + "Your HomeFix account was successfully "
                + "logged in.\n\n"
                + "If this was not you, please change "
                + "your password immediately.\n\n"
                + "HomeFix Team"
        );

        mailSender.send(message);
    }

    // =========================================
// PASSWORD RESET EMAIL
// =========================================

public void sendPasswordResetEmail(
        String email,
        String resetLink) {

    SimpleMailMessage message =
            new SimpleMailMessage();

    message.setTo(email);

    message.setSubject(
            "HomeFix - Password Reset"
    );

    message.setText(
            "Hello,\n\n"
            + "We received a request to reset your "
            + "HomeFix password.\n\n"
            + "Click the link below to create a new password:\n\n"
            + resetLink
            + "\n\n"
            + "This password reset link will expire soon.\n\n"
            + "If you did not request a password reset, "
            + "please ignore this email.\n\n"
            + "Thank you,\n"
            + "HomeFix Team"
    );

    mailSender.send(message);
}
}