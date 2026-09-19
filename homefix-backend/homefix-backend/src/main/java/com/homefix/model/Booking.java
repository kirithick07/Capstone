package com.homefix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String appliance;

    private String service;

    private String bookingDate;

    private String status;

    // Technician details
    private String technicianName;

    private String technicianPhone;

    private Long technicianId;

    // Actual technician visit time
    private String visitedStartTime;

    private String visitedEndTime;

    // Payment details
    private Double paymentAmount;

    private String paymentStatus;

    // ==========================================
    // SERVICE COMPLETION OTP
    // ==========================================

    private String completionOtp;

    private Boolean otpVerified = false;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Booking() {
    }


    // ==========================================
    // ID
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // ==========================================
    // USER ID
    // ==========================================

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    // ==========================================
    // APPLIANCE
    // ==========================================

    public String getAppliance() {
        return appliance;
    }

    public void setAppliance(String appliance) {
        this.appliance = appliance;
    }


    // ==========================================
    // SERVICE
    // ==========================================

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }


    // ==========================================
    // BOOKING DATE
    // ==========================================

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }


    // ==========================================
    // STATUS
    // ==========================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    // ==========================================
    // TECHNICIAN NAME
    // ==========================================

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }


    // ==========================================
    // TECHNICIAN PHONE
    // ==========================================

    public String getTechnicianPhone() {
        return technicianPhone;
    }

    public void setTechnicianPhone(String technicianPhone) {
        this.technicianPhone = technicianPhone;
    }


    // ==========================================
    // VISITED START TIME
    // ==========================================

    public String getVisitedStartTime() {
        return visitedStartTime;
    }

    public void setVisitedStartTime(String visitedStartTime) {
        this.visitedStartTime = visitedStartTime;
    }


    // ==========================================
// TECHNICIAN ID
// ==========================================

public Long getTechnicianId() {
    return technicianId;
}

public void setTechnicianId(Long technicianId) {
    this.technicianId = technicianId;
}


    // ==========================================
    // VISITED END TIME
    // ==========================================

    public String getVisitedEndTime() {
        return visitedEndTime;
    }

    public void setVisitedEndTime(String visitedEndTime) {
        this.visitedEndTime = visitedEndTime;
    }


    // ==========================================
    // PAYMENT AMOUNT
    // ==========================================

    public Double getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(Double paymentAmount) {
        this.paymentAmount = paymentAmount;
    }


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }


    // ==========================================
    // COMPLETION OTP
    // ==========================================

    public String getCompletionOtp() {
        return completionOtp;
    }

    public void setCompletionOtp(String completionOtp) {
        this.completionOtp = completionOtp;
    }


    // ==========================================
    // OTP VERIFIED
    // ==========================================

    public Boolean getOtpVerified() {
        return otpVerified;
    }

    public void setOtpVerified(Boolean otpVerified) {
        this.otpVerified = otpVerified;
    }
}