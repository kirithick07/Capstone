
package com.homefix.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${RESEND_FROM:HomeFix <onboarding@resend.dev>}")
    private String fromEmail;

    private final RestClient restClient = RestClient.create();

    // COMMON EMAIL METHOD
    private void sendEmail(String to, String subject, String text) {

        Map<String, Object> requestBody = Map.of(
                "from", fromEmail,
                "to", List.of(to),
                "subject", subject,
                "text", text
        );

        restClient.post()
                .uri("https://api.resend.com/emails")
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .toBodilessEntity();
    }

    // REGISTRATION VERIFICATION EMAIL
    public void sendVerificationCode(String email, String code) {
        sendEmail(
                email,
                "HomeFix - Email Verification",
                "Welcome to HomeFix!\n\n"
                + "Your email verification code is:\n\n"
                + code
                + "\n\nThis code is valid for 10 minutes.\n\n"
                + "Thank you,\nHomeFix Team"
        );
    }

    // LOGIN NOTIFICATION EMAIL
    public void sendLoginNotification(String email) {
        sendEmail(
                email,
                "HomeFix - Login Notification",
                "Hello,\n\n"
                + "Your HomeFix account was successfully logged in.\n\n"
                + "If this was not you, please change your password immediately.\n\n"
                + "HomeFix Team"
        );
    }

    // PASSWORD RESET EMAIL
    public void sendPasswordResetEmail(String email, String resetLink) {
        sendEmail(
                email,
                "HomeFix - Password Reset",
                "Hello,\n\n"
                + "We received a request to reset your HomeFix password.\n\n"
                + "Click the link below to create a new password:\n\n"
                + resetLink
                + "\n\nThis password reset link will expire soon.\n\n"
                + "If you did not request this email, please ignore it.\n\n"
                + "Thank you,\nHomeFix Team"
        );
    }
}
