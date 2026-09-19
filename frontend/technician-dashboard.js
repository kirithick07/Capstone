const API_URL = "https://homefix-backend-2q2l.onrender.com/api";

// Temporary technician ID for testing
// Ravi Kumar = ID 2
const technicianId = 2;


document.addEventListener("DOMContentLoaded", () => {

    loadTechnician(technicianId);
    loadBookings(technicianId);

});


/* ==============================
   LOAD TECHNICIAN
================================ */

async function loadTechnician(technicianId) {

    try {

        const response =
            await fetch(
                `${API_URL}/technicians/${technicianId}`
            );

        if (!response.ok) {
            throw new Error("Technician not found.");
        }

        const technician =
            await response.json();

        document.getElementById("technicianInfo").textContent =
            `${technician.name} • ${technician.specialization}`;

    } catch (error) {

        console.error("Technician error:", error);

        document.getElementById("technicianInfo").textContent =
            "Unable to load technician information.";

    }

}


/* ==============================
   LOAD ASSIGNED BOOKINGS
================================ */

async function loadBookings(technicianId) {

    try {

        const response =
            await fetch(
                `${API_URL}/bookings/technician/${technicianId}`
            );

        if (!response.ok) {
            throw new Error("Failed to load assigned services.");
        }

        const bookings =
            await response.json();

        displayBookings(bookings);

    } catch (error) {

        console.error("Booking error:", error);

        document.getElementById("bookingContainer").innerHTML = `
            <div class="no-services">
                <h3>Unable to Load Services</h3>
                <p>Please check the backend server.</p>
            </div>
        `;

    }

}


/* ==============================
   DISPLAY BOOKINGS
================================ */

function displayBookings(bookings) {

    const container =
        document.getElementById("bookingContainer");

    container.innerHTML = "";


    /* Statistics */

    document.getElementById("totalServices").textContent =
        bookings.length;


    const pending =
        bookings.filter(booking =>
            booking.status === "Technician Assigned" ||
            booking.status === "Pending" ||
            booking.status === "Service In Progress"
        ).length;


    const completed =
        bookings.filter(booking =>
            booking.status === "Completed"
        ).length;


    document.getElementById("pendingServices").textContent =
        pending;


    document.getElementById("completedServices").textContent =
        completed;


    /* No bookings */

    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="no-services">

                <h3>No Assigned Services</h3>

                <p>
                    You currently have no assigned bookings.
                </p>

            </div>
        `;

        return;
    }


    /* Create booking cards */

    bookings.forEach(booking => {

        const card =
            document.createElement("div");

        card.className = "booking-card";


        /* ==============================
           ACTION BUTTON
        ============================== */

        let actionButton = "";


        /* Technician Assigned */

        if (booking.status === "Technician Assigned") {

            actionButton = `
                <button
                    class="start-btn"
                    onclick="startService(${booking.id})">

                    Start Service

                </button>
            `;

        }


        /* Service In Progress */

        else if (booking.status === "Service In Progress") {

            actionButton = `
                <button
                    class="complete-btn"
                    onclick="completeService(${booking.id})">

                    Verify Customer OTP

                </button>
            `;

        }


        /* Completed */

        else if (booking.status === "Completed") {

            actionButton = `
                <span class="completed-text">

                    ✓ Service Completed

                </span>
            `;

        }


        /* Cancelled */

        else if (booking.status === "Cancelled") {

            actionButton = `
                <span class="cancelled-text">

                    Service Cancelled

                </span>
            `;

        }


        /* Booking card */

        card.innerHTML = `

            <div class="booking-header">

                <h3>
                    ${booking.service}
                </h3>

                <span class="status">

                    ${booking.status || "Pending"}

                </span>

            </div>


            <div class="details">


                <div class="detail">

                    <span>Booking ID</span>

                    <strong>
                        #${booking.id}
                    </strong>

                </div>


                <div class="detail">

                    <span>Customer ID</span>

                    <strong>
                        #${booking.userId}
                    </strong>

                </div>


                <div class="detail">

                    <span>Appliance</span>

                    <strong>
                        ${booking.appliance}
                    </strong>

                </div>


                <div class="detail">

                    <span>Service Date</span>

                    <strong>
                        ${booking.bookingDate}
                    </strong>

                </div>


                <div class="detail">

                    <span>Technician</span>

                    <strong>
                        ${booking.technicianName || "Not Assigned"}
                    </strong>

                </div>


                <div class="detail">

                    <span>Phone</span>

                    <strong>
                        ${booking.technicianPhone || "Not Available"}
                    </strong>

                </div>


                <div class="detail">

                    <span>Visited Time</span>

                    <strong>
                        ${getVisitedTime(booking)}
                    </strong>

                </div>


                <div class="detail">

                    <span>Payment</span>

                    <strong>
                        ${getPayment(booking)}
                    </strong>

                </div>


                <div class="detail">

                    <span>Payment Status</span>

                    <strong>
                        ${booking.paymentStatus || "Pending"}
                    </strong>

                </div>


            </div>


            <div class="actions">

                ${actionButton}

            </div>

        `;


        container.appendChild(card);

    });

}


/* ==============================
   START SERVICE
================================ */

async function startService(bookingId) {

    const confirmed =
        confirm(
            "Are you sure you want to start this service?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bookings/${bookingId}/start`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);

        }


        const updatedBooking =
            await response.json();


        alert(
            `Service #${updatedBooking.id} started successfully.`
        );


        /* Reload bookings */

        loadBookings(technicianId);


    } catch (error) {

        console.error(
            "Start service error:",
            error
        );


        alert(
            error.message ||
            "Unable to start service."
        );

    }

}


/* ==============================
   VERIFY CUSTOMER OTP
================================ */

async function completeService(bookingId) {

    /*
       Customer gives the 4-digit OTP
       to the technician after service
       is physically completed.
    */

    const otp =
        prompt(
            "Enter the 4-digit OTP given by the customer:"
        );


    if (otp === null) {
        return;
    }


    const cleanOtp =
        otp.trim();


    /* Validate OTP */

    if (!/^\d{4}$/.test(cleanOtp)) {

        alert(
            "Please enter a valid 4-digit OTP."
        );

        return;
    }


    const confirmed =
        confirm(
            "Verify this customer OTP and mark the service as completed?"
        );


    if (!confirmed) {
        return;
    }


    const data = {

        completionOtp:
            cleanOtp

    };


    try {

        const response =
            await fetch(
                `${API_URL}/bookings/${bookingId}/verify-otp`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);

        }


        const updatedBooking =
            await response.json();


        alert(
            `Service #${updatedBooking.id} completed successfully!`
        );


        /* Reload dashboard */

        loadBookings(technicianId);


    } catch (error) {

        console.error(
            "OTP verification error:",
            error
        );


        alert(
            error.message ||
            "Unable to verify OTP."
        );

    }

}


/* ==============================
   VISITED TIME
================================ */

function getVisitedTime(booking) {

    if (
        booking.visitedStartTime &&
        booking.visitedEndTime
    ) {

        return `
            ${booking.visitedStartTime}
            -
            ${booking.visitedEndTime}
        `;

    }


    return "Not Visited Yet";

}


/* ==============================
   PAYMENT
================================ */

function getPayment(booking) {

    if (
        booking.paymentAmount !== null &&
        booking.paymentAmount !== undefined
    ) {

        return `₹${booking.paymentAmount}`;

    }


    return "Not Available";

}


/* ==============================
   LOGOUT
================================ */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );
