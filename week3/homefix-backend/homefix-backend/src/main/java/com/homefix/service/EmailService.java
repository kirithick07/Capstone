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
}