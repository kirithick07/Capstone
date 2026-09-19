
package com.homefix.controller;

import com.homefix.model.Technician;
import com.homefix.repository.TechnicianRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/technicians")
@CrossOrigin(origins = "*")
public class TechnicianController {

    private final TechnicianRepository technicianRepository;

    public TechnicianController(
            TechnicianRepository technicianRepository) {

        this.technicianRepository = technicianRepository;
    }


    // ==============================
    // TECHNICIAN LOGIN
    // ==============================

    @PostMapping("/login")
    public ResponseEntity<?> technicianLogin(
            @RequestBody Technician loginData) {

        if (loginData.getId() == null ||
                loginData.getPassword() == null ||
                loginData.getPassword().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Technician ID and password are required.");
        }


        Optional<Technician> technicianOptional =
                technicianRepository.findById(
                        loginData.getId()
                );


        if (technicianOptional.isEmpty()) {

            return ResponseEntity.status(401)
                    .body("Invalid Technician ID or password.");
        }


        Technician technician =
                technicianOptional.get();


        if (technician.getPassword() == null ||
                !technician.getPassword()
                        .equals(loginData.getPassword())) {

            return ResponseEntity.status(401)
                    .body("Invalid Technician ID or password.");
        }


        return ResponseEntity.ok(technician);
    }


    // ==============================
    // CREATE TECHNICIAN
    // ==============================

    @PostMapping
    public ResponseEntity<Technician> createTechnician(
            @RequestBody Technician technician) {

        Technician savedTechnician =
                technicianRepository.save(technician);

        return ResponseEntity.ok(savedTechnician);
    }


    // ==============================
    // GET ALL TECHNICIANS
    // ==============================

    @GetMapping
    public ResponseEntity<List<Technician>> getAllTechnicians() {

        return ResponseEntity.ok(
                technicianRepository.findAll()
        );
    }


    // ==============================
    // GET TECHNICIAN BY ID
    // ==============================

    @GetMapping("/{id}")
    public ResponseEntity<?> getTechnicianById(
            @PathVariable Long id) {

        Optional<Technician> technicianOptional =
                technicianRepository.findById(id);

        if (technicianOptional.isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                technicianOptional.get()
        );
    }


    // ==============================
    // GET AVAILABLE TECHNICIANS
    // ==============================

    @GetMapping("/available")
    public ResponseEntity<List<Technician>>
    getAvailableTechnicians() {

        return ResponseEntity.ok(
                technicianRepository.findByAvailableTrue()
        );
    }


    // ==============================
    // UPDATE TECHNICIAN AVAILABILITY
    // ==============================

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean available) {

        Optional<Technician> technicianOptional =
                technicianRepository.findById(id);

        if (technicianOptional.isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        Technician technician =
                technicianOptional.get();

        technician.setAvailable(available);

        Technician updatedTechnician =
                technicianRepository.save(technician);

        return ResponseEntity.ok(updatedTechnician);
    }


    // ==============================
    // DELETE TECHNICIAN
    // ==============================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTechnician(
            @PathVariable Long id) {

        if (!technicianRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        technicianRepository.deleteById(id);

        return ResponseEntity.ok(
                "Technician deleted successfully."
        );
    }

}

