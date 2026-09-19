package com.homefix.repository;

import com.homefix.model.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PasswordResetRepository
        extends JpaRepository<PasswordReset, Long> {

    Optional<PasswordReset> findByToken(String token);

    Optional<PasswordReset> findByEmail(String email);

    @Modifying
    @Query("DELETE FROM PasswordReset p WHERE p.email = :email")
    void deleteByEmail(String email);
}