package com.homefix.service;

import com.homefix.repository.PendingRegistrationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;

    @Transactional
    public void deletePendingRegistrationByEmail(String email) {

        pendingRegistrationRepository.deleteByEmail(email);
    }
}