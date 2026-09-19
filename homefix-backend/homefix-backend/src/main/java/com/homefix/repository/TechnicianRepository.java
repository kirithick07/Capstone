
package com.homefix.repository;

import com.homefix.model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TechnicianRepository
        extends JpaRepository<Technician, Long> {

    List<Technician> findByAvailableTrue();

    Optional<Technician> findByEmail(String email);

}

