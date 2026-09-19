package com.homefix.service;

import com.homefix.model.EmailVerification;
import com.homefix.repository.EmailVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VerificationService {

    private final EmailVerificationRepository repository;
    private final EmailService emailService;

    public VerificationService(
            EmailVerificationRepository repository,
            EmailService emailService) {

        this.repository = repository;
        this.emailService = emailService;
    }

    @Transactional
    public void sendCode(String email) {

        String code =
                String.format(
                        "%06d",
                        new Random().nextInt(1000000)
                );

        // Delete previous OTP
        repository.deleteByEmail(email);

        // Create new OTP
        EmailVerification verification =
                new EmailVerification(
                        email,
                        code,
                        LocalDateTime.now().plusMinutes(10)
                );

        repository.save(verification);

        // Send OTP email
        emailService.sendVerificationCode(
                email,
                code
        );
    }

    @Transactional
    public boolean verifyCode(
            String email,
            String code) {

        var result =
                repository.findTopByEmailOrderByIdDesc(
                        email
                );

        if (result.isEmpty()) {
            return false;
        }

        EmailVerification verification =
                result.get();

        // Check expiry
        if (verification.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            return false;
        }

        // Check OTP
        if (!verification.getCode()
                .equals(code)) {

            return false;
        }

        // Delete verified OTP
        repository.delete(verification);

        return true;
    }
}