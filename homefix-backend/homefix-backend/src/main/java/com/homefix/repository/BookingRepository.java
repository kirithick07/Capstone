
package com.homefix.repository;

import com.homefix.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings of a customer
    List<Booking> findByUserId(Long userId);

    // Get bookings by technician name
    List<Booking> findByTechnicianName(String technicianName);

    // Get bookings assigned to a specific technician
    List<Booking> findByTechnicianId(Long technicianId);

    // Get bookings by status
    List<Booking> findByStatus(String status);

    // Get pending bookings
    List<Booking> findByStatusIgnoreCase(String status);
}

