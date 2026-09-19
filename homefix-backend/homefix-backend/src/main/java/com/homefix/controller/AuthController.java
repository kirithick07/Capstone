package com.homefix.controller;

import org.springframework.transaction.annotation.Transactional;

import com.homefix.model.User;
import com.homefix.model.PasswordReset;
import com.homefix.model.PendingRegistration;
import com.homefix.repository.UserRepository;
import com.homefix.repository.PasswordResetRepository;
import com.homefix.repository.PendingRegistrationRepository;
import com.homefix.service.EmailService;
import com.homefix.service.VerificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import com.homefix.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthService authService;


    // =========================================
    // REGISTER
    // =========================================

  @PostMapping("/register")
@Transactional
public ResponseEntity<?> register(
        @RequestBody User user) {

        try {

            // Check whether email is already registered
            if (userRepository
                    .findByEmail(user.getEmail())
                    .isPresent()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Email already registered");
            }


            // Check whether username is already used
            if (userRepository
                    .findByUsername(user.getUsername())
                    .isPresent()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Username already taken");
            }


            // Remove previous pending registration
          pendingRegistrationRepository.deleteByEmail(
        user.getEmail()
);


            // Create pending registration
            PendingRegistration pending =
                    new PendingRegistration();

            pending.setName(user.getName());
            pending.setUsername(user.getUsername());
            pending.setEmail(user.getEmail());
            pending.setPassword(user.getPassword());
            pending.setPhone(user.getPhone());

            // OTP registration expires after 10 minutes
            pending.setExpiryTime(
                    LocalDateTime.now().plusMinutes(10)
            );


            // Save pending registration
            pendingRegistrationRepository.save(pending);


            // Send OTP
            verificationService.sendCode(
                    user.getEmail()
            );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP sent to your email"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Could not send OTP: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================
    // VERIFY EMAIL / OTP
    // =========================================

    @PostMapping("/verify-code")
    @Transactional
    public ResponseEntity<?> verifyCode(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");

            String code =
                    request.get("code");


            // Check email
            if (email == null ||
                    email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required");
            }


            // Check OTP
            if (code == null ||
                    code.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Verification code is required"
                        );
            }


            // Verify OTP
            boolean verified =
                    verificationService.verifyCode(
                            email,
                            code
                    );


            if (!verified) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Invalid or expired verification code."
                        );
            }


            // Find pending registration
            PendingRegistration pending =
                    pendingRegistrationRepository
                            .findByEmail(email)
                            .orElse(null);


            if (pending == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Registration request not found or expired."
                        );
            }


            // Check pending registration expiry
            if (pending.getExpiryTime()
                    .isBefore(LocalDateTime.now())) {

                pendingRegistrationRepository
                        .delete(pending);

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Registration request has expired. Please register again."
                        );
            }


            // Check username again
            if (userRepository
                    .findByUsername(
                            pending.getUsername()
                    )
                    .isPresent()) {

                pendingRegistrationRepository
                        .delete(pending);

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Username already taken."
                        );
            }


            // Check email again
            if (userRepository
                    .findByEmail(
                            pending.getEmail()
                    )
                    .isPresent()) {

                pendingRegistrationRepository
                        .delete(pending);

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Email already registered."
                        );
            }


            // Create actual user
            User user =
                    new User();

            user.setName(
                    pending.getName()
            );

            user.setUsername(
                    pending.getUsername()
            );

            user.setEmail(
                    pending.getEmail()
            );

            user.setPassword(
                    pending.getPassword()
            );

            user.setPhone(
                    pending.getPhone()
            );


            // Save actual user
            User savedUser =
                    userRepository.save(user);


            // Delete pending registration
            pendingRegistrationRepository
                    .delete(pending);


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Account created successfully!",
                            "user",
                            savedUser
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Verification failed: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================
    // RESEND OTP
    // =========================================

    @PostMapping("/send-code")
    @Transactional
    public ResponseEntity<?> sendCode(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");


            if (email == null ||
                    email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Email is required"
                        );
            }


            // Find pending registration
            PendingRegistration pending =
                    pendingRegistrationRepository
                            .findByEmail(email)
                            .orElse(null);


            if (pending == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "Registration request not found."
                        );
            }


            // Check expiry
            if (pending.getExpiryTime()
                    .isBefore(LocalDateTime.now())) {

                pendingRegistrationRepository
                        .delete(pending);

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Registration request has expired. Please register again."
                        );
            }


            // Send new OTP
            verificationService.sendCode(email);


            // Extend expiry by 10 minutes
            pending.setExpiryTime(
                    LocalDateTime.now()
                            .plusMinutes(10)
            );


            // Save updated pending registration
            pendingRegistrationRepository
                    .save(pending);


            return ResponseEntity.ok(
                    "Verification code sent successfully."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Could not send verification code: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginUser) {

        try {

            User user =
                    userRepository
                            .findByEmail(
                                    loginUser.getEmail()
                            )
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                "Invalid email or password"
                        );
            }


            if (!user.getPassword()
                    .equals(loginUser.getPassword())) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                "Invalid email or password"
                        );
            }


            // Login notification
            emailService.sendLoginNotification(
                    user.getEmail()
            );


            return ResponseEntity.ok(user);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Login failed: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================
    // FORGOT PASSWORD
    // =========================================

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");


            if (email == null ||
                    email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Email is required"
                        );
            }


            // Find user
            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "Email is not registered"
                        );
            }


            // Delete previous reset request
            passwordResetRepository
                    .deleteByEmail(email);


            // Generate reset token
            String token =
                    UUID.randomUUID()
                            .toString();


            // Expire after 15 minutes
            LocalDateTime expiryTime =
                    LocalDateTime.now()
                            .plusMinutes(15);


            PasswordReset passwordReset =
                    new PasswordReset(
                            email,
                            token,
                            expiryTime
                    );


            passwordResetRepository
                    .save(passwordReset);


            // Local development reset link
            String resetLink =
                    "http://127.0.0.1:5500/frontend/html/reset-password.html?token="
                            + token;


            // Send email
            emailService.sendPasswordResetEmail(
                    email,
                    resetLink
            );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password reset link has been sent to your email."
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Could not send password reset email: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================
    // RESET PASSWORD
    // =========================================

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        try {

            String token =
                    request.get("token");

            String newPassword =
                    request.get("password");


            if (token == null ||
                    token.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Reset token is required"
                        );
            }


            if (newPassword == null ||
                    newPassword.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "New password is required"
                        );
            }


            // Find reset token
            PasswordReset passwordReset =
                    passwordResetRepository
                            .findByToken(token)
                            .orElse(null);


            if (passwordReset == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Invalid password reset link"
                        );
            }


            // Check expiry
            if (passwordReset
                    .getExpiryTime()
                    .isBefore(LocalDateTime.now())) {

                passwordResetRepository
                        .delete(passwordReset);

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Password reset link has expired"
                        );
            }


            // Find user
            User user =
                    userRepository
                            .findByEmail(
                                    passwordReset.getEmail()
                            )
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "User not found"
                        );
            }


            // Update password
            user.setPassword(newPassword);

            userRepository.save(user);


            // Delete used reset token
            passwordResetRepository
                    .delete(passwordReset);


            return ResponseEntity.ok(
                    "Password reset successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Could not reset password: "
                                    + e.getMessage()
                    );
        }
    }
}