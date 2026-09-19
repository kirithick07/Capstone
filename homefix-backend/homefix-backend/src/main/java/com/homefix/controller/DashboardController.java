package com.homefix.controller;

import com.homefix.repository.BookingRepository;
import com.homefix.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public DashboardController(
            UserRepository userRepository,
            BookingRepository bookingRepository) {

        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalBookings", bookingRepository.count());

        return stats;
    }
}