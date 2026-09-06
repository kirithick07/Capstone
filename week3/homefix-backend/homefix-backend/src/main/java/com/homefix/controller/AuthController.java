package com.homefix.controller;

import com.homefix.model.User;
import com.homefix.repository.UserRepository;
import com.homefix.service.EmailService;
import com.homefix.service.VerificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private EmailService emailService;


    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        try {

            // Check email already exists
            if (userRepository
                    .findByEmail(user.getEmail())
                    .isPresent()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Email already registered");
            }


            // Save user
            User savedUser =
                    userRepository.save(user);


            // Send verification code
            verificationService.sendCode(
                    savedUser.getEmail()
            );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: "
                            + e.getMessage());
        }
    }


    // =========================================
    // VERIFY EMAIL
    // =========================================

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");

            String code =
                    request.get("code");


            if (email == null ||
                    email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required");
            }


            if (code == null ||
                    code.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Verification code is required");
            }


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


            return ResponseEntity.ok(
                    "Email verified successfully."
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
    // SEND VERIFICATION CODE AGAIN
    // =========================================

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");


            if (email == null ||
                    email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required");
            }


            // Check whether user exists
            if (userRepository
                    .findByEmail(email)
                    .isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Email is not registered");
            }


            verificationService.sendCode(email);


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


            // User not found
            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                "Invalid email or password"
                        );
            }


            // Password check
            if (!user.getPassword()
                    .equals(loginUser.getPassword())) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                "Invalid email or password"
                        );
            }


            // =====================================
            // LOGIN SUCCESS
            // =====================================

            // Send login notification email
            emailService.sendLoginNotification(
                    user.getEmail()
            );


            // Return user to JavaScript
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
}