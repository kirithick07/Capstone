
// ==========================================
// HOMEFIX - APPOINTMENT PAGE
// ==========================================

const API_URL = "http://localhost:8080/api/bookings";

let appointments = [];


// ==========================================
// GET LOGGED-IN USER
// ==========================================

function getUserId() {

    const userId = localStorage.getItem("userId");

    console.log("Logged-in User ID:", userId);

    return userId;
}


// ==========================================
// SERVICE IMAGES
// ==========================================

const serviceImages = {

    "AC Repair":
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",

    "Installation":
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",

    "TV Installation":
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"

};


// ==========================================
// LOAD APPOINTMENTS
// ==========================================

async function loadAppointments() {

    const list =
        document.getElementById("appointmentsList");

    const next =
        document.getElementById("nextAppointment");

    const count =
        document.getElementById("appointmentCount");

    try {

        list.innerHTML = `
            <div class="empty">
                <h3>Loading appointments...</h3>
                <p>Please wait.</p>
            </div>
        `;

        const userId = getUserId();

        if (!userId) {

            alert("Please login first.");

            window.location.href = "login.html";

            return;
        }

        // ==========================================
        // GET ONLY LOGGED-IN USER'S APPOINTMENTS
        // ==========================================

        const response = await fetch(
            `${API_URL}/user/${userId}`
        );

        if (!response.ok) {

            throw new Error(
                "Failed to get appointments"
            );
        }

        appointments =
            await response.json();

        console.log(
            "Appointments from MySQL for User ID:",
            userId,
            appointments
        );

        // ==========================================
        // APPOINTMENT COUNT
        // ==========================================

        count.textContent =
            `${appointments.length} Appointment${appointments.length !== 1 ? "s" : ""}`;

        // ==========================================
        // NO APPOINTMENTS
        // ==========================================

        if (appointments.length === 0) {

            showNoAppointments();

            return;
        }

        // ==========================================
        // SORT BY BOOKING DATE
        // ==========================================

        appointments.sort(
            (a, b) =>
                new Date(a.bookingDate) -
                new Date(b.bookingDate)
        );

        // ==========================================
        // DISPLAY
        // ==========================================

        displayNextAppointment();

        displayAllAppointments();

    } catch (error) {

        console.error(
            "Appointment error:",
            error
        );

        next.innerHTML = `
            <div class="empty">

                <h3>
                    Unable to load appointments
                </h3>

                <p>
                    Please make sure Spring Boot is running.
                </p>

            </div>
        `;

        list.innerHTML = `
            <div class="empty">

                <h3>
                    Server Connection Error
                </h3>

                <p>
                    Could not connect to:
                </p>

                <p>
                    ${API_URL}
                </p>

            </div>
        `;

        count.textContent =
            "0 Appointments";
    }
}


// ==========================================
// GET SERVICE IMAGE
// ==========================================

function getServiceImage(appointment) {

    if (appointment.service === "AC Repair") {

        return serviceImages["AC Repair"];
    }

    if (
        appointment.service === "Installation" &&
        appointment.appliance === "Television"
    ) {

        return serviceImages["Installation"];
    }

    if (
        appointment.service === "TV Installation"
    ) {

        return serviceImages["TV Installation"];
    }

    return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    if (!status) {

        return "pending";
    }

    const value =
        status.toLowerCase();

    if (value === "completed") {

        return "completed";
    }

    if (
        value === "cancelled" ||
        value === "canceled"
    ) {

        return "cancelled";
    }

    return "pending";
}


// ==========================================
// GET TECHNICIAN DISPLAY
// ==========================================

function getTechnicianName(appointment) {

    if (
        appointment.technicianName &&
        appointment.technicianName.trim() !== ""
    ) {

        return appointment.technicianName;
    }

    return "Not Assigned";
}


// ==========================================
// DISPLAY TECHNICIAN
// ==========================================

function getTechnicianSection(appointment) {

    const technicianName =
        getTechnicianName(appointment);

    return `
        <p class="technician-info">
            👨‍🔧
            <strong>Technician:</strong>
            ${technicianName}
        </p>
    `;
}


// ==========================================
// GET OTP SECTION
// ==========================================

function getOtpSection(appointment) {

    const status =
        appointment.status?.toLowerCase() || "";

    // ==========================================
    // DO NOT SHOW OTP AFTER COMPLETION
    // ==========================================

    if (
        status === "completed" ||
        status === "cancelled" ||
        status === "canceled"
    ) {

        return "";
    }

    // ==========================================
    // OTP DOES NOT EXIST
    // ==========================================

    if (!appointment.completionOtp) {

        return "";
    }

    const technicianName =
        getTechnicianName(appointment);

    // ==========================================
    // OTP MESSAGE
    // ==========================================

    if (technicianName === "Not Assigned") {

        return `
            <div class="completion-otp">

                <div class="completion-otp-title">
                    🔐 Service Completion OTP
                </div>

                <div class="completion-otp-code">
                    ${appointment.completionOtp}
                </div>

                <div class="completion-otp-message">
                    Your technician has not been assigned yet.
                    Give this OTP to the technician after
                    the service is completed.
                </div>

            </div>
        `;
    }

    return `
        <div class="completion-otp">

            <div class="completion-otp-title">
                🔐 Service Completion OTP
            </div>

            <div class="completion-otp-code">
                ${appointment.completionOtp}
            </div>

            <div class="completion-otp-message">
                Give this OTP to
                <strong>${technicianName}</strong>
                after the service is completed.
            </div>

        </div>
    `;
}


// ==========================================
// DISPLAY NEXT APPOINTMENT
// ==========================================

function displayNextAppointment() {

    const next =
        document.getElementById(
            "nextAppointment"
        );

    const upcoming =
        appointments.filter(
            appointment => {

                const status =
                    appointment.status?.toLowerCase();

                return (
                    status !== "completed" &&
                    status !== "cancelled" &&
                    status !== "canceled"
                );
            }
        );

    // ==========================================
    // NO UPCOMING APPOINTMENT
    // ==========================================

    if (upcoming.length === 0) {

        next.innerHTML = `
            <div class="empty">

                <h3>
                    No Upcoming Appointment
                </h3>

                <p>
                    You don't have any pending appointments.
                </p>

            </div>
        `;

        return;
    }

    // ==========================================
    // FIRST UPCOMING APPOINTMENT
    // ==========================================

    const appointment =
        upcoming[0];

    const image =
        getServiceImage(appointment);

    next.innerHTML = `

        <div class="next-card">

            <img
                src="${image}"
                class="service-image"
                alt="${appointment.appliance}"
            >

            <div class="next-details">

                <h3>
                    ${appointment.appliance}
                </h3>

                <p>
                    🔧
                    <strong>Service:</strong>
                    ${appointment.service}
                </p>

                <p>
                    📅
                    <strong>Date:</strong>
                    ${formatDate(
                        appointment.bookingDate
                    )}
                </p>

                <p>
                    🆔
                    <strong>Booking ID:</strong>
                    #${appointment.id}
                </p>

                ${getTechnicianSection(appointment)}

                <span
                    class="status ${getStatusClass(
                        appointment.status
                    )}"
                >
                    ${appointment.status || "Pending"}
                </span>

                ${getOtpSection(appointment)}

            </div>

        </div>

    `;
}


// ==========================================
// DISPLAY ALL APPOINTMENTS
// ==========================================

function displayAllAppointments() {

    const list =
        document.getElementById(
            "appointmentsList"
        );

    list.innerHTML = "";

    appointments.forEach(
        appointment => {

            list.innerHTML +=
                createAppointmentCard(
                    appointment
                );
        }
    );
}


// ==========================================
// CREATE APPOINTMENT CARD
// ==========================================

function createAppointmentCard(
    appointment
) {

    const image =
        getServiceImage(appointment);

    const status =
        appointment.status || "Pending";

    const lowerStatus =
        status.toLowerCase();

    return `

        <div class="appointment-card">

            <img
                src="${image}"
                class="appointment-image"
                alt="${appointment.appliance}"
            >

            <div class="appointment-details">

                <h3>
                    ${appointment.appliance}
                </h3>

                <p>
                    🔧
                    <strong>Service:</strong>
                    ${appointment.service}
                </p>

                <p>
                    📅
                    ${formatDate(
                        appointment.bookingDate
                    )}
                </p>

                <p>
                    🆔
                    Booking #${appointment.id}
                </p>

                ${getTechnicianSection(appointment)}

                <span
                    class="status ${getStatusClass(
                        status
                    )}"
                >
                    ${status}
                </span>

                ${getOtpSection(appointment)}

            </div>

            ${
                lowerStatus === "pending"
                    ?
                    `
                    <button
                        class="cancel-btn"
                        onclick="cancelAppointment(
                            ${appointment.id}
                        )"
                    >
                        Cancel
                    </button>
                    `
                    :
                    ""
            }

        </div>

    `;
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "Not specified";
    }

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


// ==========================================
// CANCEL APPOINTMENT
// ==========================================

async function cancelAppointment(id) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );

    if (!confirmCancel) {

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/${id}/cancel`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(
                message ||
                "Failed to cancel booking"
            );
        }

        alert(
            "Booking cancelled successfully!"
        );

        await loadAppointments();

    } catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );

        alert(
            error.message ||
            "Unable to cancel booking."
        );
    }
}


// ==========================================
// NO APPOINTMENTS
// ==========================================

function showNoAppointments() {

    const next =
        document.getElementById(
            "nextAppointment"
        );

    const list =
        document.getElementById(
            "appointmentsList"
        );

    next.innerHTML = `

        <div class="empty">

            <h3>
                No Upcoming Appointment
            </h3>

            <p>
                You don't have any pending appointments.
            </p>

        </div>

    `;

    list.innerHTML = `

        <div class="empty">

            <h3>
                No Appointments
            </h3>

            <p>
                You don't have any bookings yet.
            </p>

        </div>

    `;
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAppointments();

    }
);

