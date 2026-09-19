package com.homefix.controller;

import com.homefix.model.Booking;
import com.homefix.model.Technician;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.TechnicianRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final TechnicianRepository technicianRepository;

    public BookingController(
            BookingRepository bookingRepository,
            TechnicianRepository technicianRepository) {

        this.bookingRepository = bookingRepository;
        this.technicianRepository = technicianRepository;
    }


    // ==========================================
    // CREATE BOOKING
    // ==========================================

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking) {

        booking.setStatus("Pending");

        // Generate a random 4-digit service completion OTP
        String otp = String.format(
                "%04d",
                ThreadLocalRandom.current().nextInt(1000, 10000)
        );

        booking.setCompletionOtp(otp);

        // OTP is not verified when booking is created
        booking.setOtpVerified(false);

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
    // GET BOOKING BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(
            @PathVariable Long id) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(id);

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                bookingOptional.get()
        );
    }


    // ==========================================
    // UPDATE SERVICE DETAILS
    // ==========================================

    @PutMapping("/{id}/service-details")
    public ResponseEntity<?> updateServiceDetails(
            @PathVariable Long id,
            @RequestBody Booking updatedData) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(id);

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking =
                bookingOptional.get();

        booking.setTechnicianName(
                updatedData.getTechnicianName()
        );

        booking.setTechnicianPhone(
                updatedData.getTechnicianPhone()
        );

        booking.setVisitedStartTime(
                updatedData.getVisitedStartTime()
        );

        booking.setVisitedEndTime(
                updatedData.getVisitedEndTime()
        );

        booking.setPaymentAmount(
                updatedData.getPaymentAmount()
        );

        booking.setPaymentStatus(
                updatedData.getPaymentStatus()
        );

        if (updatedData.getStatus() != null &&
                !updatedData.getStatus().isEmpty()) {

            booking.setStatus(
                    updatedData.getStatus()
            );
        }

        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }


    // ==========================================
    // ASSIGN TECHNICIAN
    // ==========================================

    @PutMapping("/{bookingId}/assign-technician/{technicianId}")
    public ResponseEntity<?> assignTechnician(
            @PathVariable Long bookingId,
            @PathVariable Long technicianId) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(bookingId);

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Technician> technicianOptional =
                technicianRepository.findById(technicianId);

        if (technicianOptional.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Technician not found.");
        }

        Technician technician =
                technicianOptional.get();

        if (!technician.isAvailable()) {

            return ResponseEntity.badRequest()
                    .body("Technician is not available.");
        }

        Booking booking =
                bookingOptional.get();

        booking.setTechnicianName(
                technician.getName()
        );

        booking.setTechnicianPhone(
                technician.getPhone()
        );

        booking.setStatus(
                "Technician Assigned"
        );

        // Technician becomes unavailable
        technician.setAvailable(false);

        technicianRepository.save(technician);

        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }


    // ==========================================
    // GET BOOKINGS FOR TECHNICIAN
    // ==========================================

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<?> getTechnicianBookings(
            @PathVariable Long technicianId) {

        Optional<Technician> technicianOptional =
                technicianRepository.findById(technicianId);

        if (technicianOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Technician technician =
                technicianOptional.get();

        List<Booking> bookings =
                bookingRepository.findByTechnicianName(
                        technician.getName()
                );

        return ResponseEntity.ok(bookings);
    }


    // ==========================================
    // START SERVICE
    // ==========================================

    @PutMapping("/{id}/start")
    public ResponseEntity<?> startService(
            @PathVariable Long id) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(id);

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking =
                bookingOptional.get();

        if ("Cancelled".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Cancelled booking cannot be started."
                    );
        }

        if ("Completed".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Completed booking cannot be started."
                    );
        }

        if (!"Technician Assigned".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Only an assigned service can be started."
                    );
        }

        booking.setStatus(
                "Service In Progress"
        );

        Booking updatedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(
                updatedBooking
        );
    }


    // ==========================================
    // VERIFY SERVICE COMPLETION OTP
    // ==========================================

    @PutMapping("/{id}/verify-otp")
    public ResponseEntity<?> verifyCompletionOtp(
            @PathVariable Long id,
            @RequestBody Booking updatedData) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(id);

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking =
                bookingOptional.get();

        // Service must be in progress
        if (!"Service In Progress".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Service must be in progress before OTP verification."
                    );
        }

        // Check OTP
        if (updatedData.getCompletionOtp() == null ||
                !updatedData.getCompletionOtp()
                        .equals(booking.getCompletionOtp())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Invalid completion OTP."
                    );
        }

        // OTP verified
        booking.setOtpVerified(true);

        // Mark service completed
        booking.setStatus("Completed");

        // ==========================================
        // MAKE TECHNICIAN AVAILABLE AGAIN
        // ==========================================

        String technicianName =
                booking.getTechnicianName();

        if (technicianName != null &&
                !technicianName.isEmpty()) {

            List<Technician> technicians =
                    technicianRepository.findAll();

            for (Technician technician : technicians) {

                if (technicianName.equals(
                        technician.getName())) {

                    technician.setAvailable(true);

                    technicianRepository.save(
                            technician
                    );

                    break;
                }
            }
        }

        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(
                savedBooking
        );
    }


    // ==========================================
    // COMPLETE SERVICE
    // ==========================================

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeService(
            @PathVariable Long id,
            @RequestBody Booking updatedData) {

        Optional<Booking> bookingOptional =
                bookingRepository.findById(id);

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking =
                bookingOptional.get();

        // OTP must be verified first
        if (!Boolean.TRUE.equals(
                booking.getOtpVerified())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Customer completion OTP must be verified first."
                    );
        }

        // Service must be in progress
        if (!"Service In Progress".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Service must be in progress before completion."
                    );
        }

        // Save visit details
        booking.setVisitedStartTime(
                updatedData.getVisitedStartTime()
        );

        booking.setVisitedEndTime(
                updatedData.getVisitedEndTime()
        );

        // Save payment details
        booking.setPaymentAmount(
                updatedData.getPaymentAmount()
        );

        booking.setPaymentStatus(
                updatedData.getPaymentStatus()
        );

        // Mark booking completed
        booking.setStatus(
                "Completed"
        );

        // ==========================================
        // MAKE TECHNICIAN AVAILABLE AGAIN
        // ==========================================

        String technicianName =
                booking.getTechnicianName();

        if (technicianName != null &&
                !technicianName.isEmpty()) {

            List<Technician> technicians =
                    technicianRepository.findAll();

            for (Technician technician : technicians) {

                if (technicianName.equals(
                        technician.getName())) {

                    technician.setAvailable(true);

                    technicianRepository.save(
                            technician
                    );

                    break;
                }
            }
        }

        // Save completed booking
        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(
                savedBooking
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

        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking =
                bookingOptional.get();

        if ("Cancelled".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Booking is already cancelled."
                    );
        }

        if ("Completed".equalsIgnoreCase(
                booking.getStatus())) {

            return ResponseEntity.badRequest()
                    .body(
                            "Completed booking cannot be cancelled."
                    );
        }

        booking.setStatus(
                "Cancelled"
        );

        Booking updatedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(
                updatedBooking
        );
    }
}