package com.homefix.controller;

import com.homefix.model.Admin;
import com.homefix.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin loginRequest) {

        Optional<Admin> adminOptional =
                adminRepository.findByUsername(loginRequest.getUsername());

        if (adminOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Invalid username or password");
        }

        Admin admin = adminOptional.get();

        if (!admin.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Invalid username or password");
        }

        return ResponseEntity.ok(admin);
    }
}