
package com.homefix.controller;

import com.homefix.model.Booking;
import com.homefix.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }


    // ==========================================
    // CREATE BOOKING
    // ==========================================

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking) {

        booking.setStatus("Pending");

        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }


    // ==========================================
    // GET BOOKINGS FOR USER
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(
            @PathVariable Long userId) {

        List<Booking> bookings =
                bookingRepository.findByUserId(userId);

        return ResponseEntity.ok(bookings);
    }


    // ==========================================
    // GET ALL BOOKINGS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingRepository.findAll()
        );
    }


    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(id);


        // Booking not found
        if (bookingOptional.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Get booking
        Booking booking =
                bookingOptional.get();


        // Check current status
        if ("Cancelled".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body("Booking is already cancelled.");
        }


        // Check completed booking
        if ("Completed".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body("Completed booking cannot be cancelled.");
        }


        // Change status
        booking.setStatus("Cancelled");


        // Save to MySQL
        Booking updatedBooking =
                bookingRepository.save(booking);


        return ResponseEntity.ok(
                updatedBooking
        );
    }
}

