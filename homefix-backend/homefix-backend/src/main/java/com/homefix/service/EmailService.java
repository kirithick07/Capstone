package com.homefix.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private final String resendApiKey =
            System.getenv("RESEND_API_KEY");

    private void sendEmail(
            String to,
            String subject,
            String text) {

        if (resendApiKey == null || resendApiKey.isBlank()) {
            throw new RuntimeException(
                    "RESEND_API_KEY is not configured"
            );
        }

        String json =
                "{"
                + "\"from\":\"HomeFix <onboarding@resend.dev>\","
                + "\"to\":[\"" + escapeJson(to) + "\"],"
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"text\":\"" + escapeJson(text) + "\""
                + "}";

        try {
            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(
                                    "https://api.resend.com/emails"
                            ))
                            .header(
                                    "Authorization",
                                    "Bearer " + resendApiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(json)
                            )
                            .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Resend email failed. HTTP "
                        + response.statusCode()
                        + ": "
                        + response.body()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send email through Resend",
                    e
            );
        }
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
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