
package com.homefix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "technicians")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String phone;

    private String email;

    private String specialization;

    private String password;

    private boolean available;


    public Technician() {
    }


    // ==============================
    // ID
    // ==============================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // ==============================
    // NAME
    // ==============================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    // ==============================
    // PHONE
    // ==============================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    // ==============================
    // EMAIL
    // ==============================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    // ==============================
    // SPECIALIZATION
    // ==============================

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }


    // ==============================
    // PASSWORD
    // ==============================

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    // ==============================
    // AVAILABILITY
    // ==============================

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

}

