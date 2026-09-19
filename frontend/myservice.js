const API_URL = "https://homefix-backend-2q2l.onrender.com/api/bookings";

let allBookings = [];


document.addEventListener("DOMContentLoaded", () => {

    loadMyServices();

    setupFilters();

});


/* ==============================
   LOAD MY SERVICES
================================ */

async function loadMyServices() {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        console.error("User ID not found in localStorage.");

        showError("Please login again.");

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/user/${userId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch services."
            );

        }


        allBookings =
            await response.json();


        displayServices(allBookings);


    } catch (error) {

        console.error(
            "Error loading services:",
            error
        );


        showError(
            "Unable to load your services. Please check the backend server."
        );

    }

}


/* ==============================
   DISPLAY SERVICES
================================ */

function displayServices(bookings) {

    const container =
        document.getElementById(
            "servicesContainer"
        );

    const noServices =
        document.getElementById(
            "noServices"
        );


    if (!container) {

        console.error(
            "servicesContainer not found."
        );

        return;
    }


    container.innerHTML = "";


    /* No bookings */

    if (!bookings || bookings.length === 0) {

        if (noServices) {
            noServices.style.display = "block";
        }

        return;
    }


    if (noServices) {
        noServices.style.display = "none";
    }


    /* Create cards */

    bookings.forEach(booking => {

        const card =
            createServiceCard(booking);


        container.appendChild(card);

    });

}


/* ==============================
   CREATE SERVICE CARD
================================ */

function createServiceCard(booking) {

    const card =
        document.createElement("div");


    card.className =
        "service-card";


    const status =
        booking.status || "Pending";


    card.setAttribute(
        "data-status",
        status
    );


    /* ==========================
       SERVICE INFORMATION
    ========================== */

    const service =
        booking.service ||
        "Service";


    const appliance =
        booking.appliance ||
        "Not Available";


    const bookingDate =
        booking.bookingDate ||
        "Not Available";


    /* ==========================
       TECHNICIAN
    ========================== */

    let technicianHTML =
        "Not Assigned";


    if (booking.technicianName) {

        technicianHTML = `
            ${escapeHTML(booking.technicianName)}
            ${
                booking.technicianPhone
                    ? `<small>
                        ${escapeHTML(
                            booking.technicianPhone
                        )}
                       </small>`
                    : ""
            }
        `;

    }


    /* ==========================
       VISITED TIME
    ========================== */

    let visitedTime =
        "Not Visited Yet";


    if (
        booking.visitedStartTime &&
        booking.visitedEndTime
    ) {

        visitedTime =
            `${escapeHTML(
                booking.visitedStartTime
            )} - ${escapeHTML(
                booking.visitedEndTime
            )}`;

    }


    /* ==========================
       PAYMENT
    ========================== */

    let payment =
        "Not Available";


    if (
        booking.paymentAmount !== null &&
        booking.paymentAmount !== undefined
    ) {

        payment =
            `₹${booking.paymentAmount}`;

    }


    /* ==========================
       PAYMENT STATUS
    ========================== */

    const paymentStatus =
        booking.paymentStatus ||
        "Pending";


    const paymentClass =
        getPaymentClass(paymentStatus);


    /* ==========================
       FOOTER MESSAGE
    ========================== */

    const footerMessage =
        getFooterMessage(status);


    /* ==========================
       SERVICE CARD
    ========================== */

    card.innerHTML = `

        <div class="service-top">

            <div>

                <h2>
                    🔧 ${escapeHTML(service)}
                </h2>

                <p class="appliance">
                    ${escapeHTML(appliance)}
                </p>

            </div>


            <span class="status ${getStatusClass(status)}">

                ${getStatusIcon(status)}
                ${escapeHTML(status)}

            </span>

        </div>


        <div class="service-info">


            <div class="info-box">

                <span>Booking ID</span>

                <strong>
                    #${booking.id}
                </strong>

            </div>


            <div class="info-box">

                <span>Service Date</span>

                <strong>
                    ${escapeHTML(bookingDate)}
                </strong>

            </div>


            <div class="info-box">

                <span>Technician</span>

                <strong>
                    ${technicianHTML}
                </strong>

            </div>


            <div class="info-box">

                <span>Visited Time</span>

                <strong>
                    ${visitedTime}
                </strong>

            </div>


            <div class="info-box">

                <span>Payment</span>

                <strong>
                    ${payment}
                </strong>

            </div>


            <div class="info-box">

                <span>Payment Status</span>

                <strong class="${paymentClass}">
                    ${getPaymentIcon(paymentStatus)}
                    ${escapeHTML(paymentStatus)}
                </strong>

            </div>


        </div>


        <div class="service-footer">

            <span class="${getFooterClass(status)}">

                ${footerMessage}

            </span>


            <button
                class="details-btn"
                onclick="viewServiceDetails(${booking.id})">

                View Details

            </button>

        </div>

    `;


    return card;

}


/* ==============================
   FILTERS
================================ */

function setupFilters() {

    const filters =
        document.querySelectorAll(
            ".filter"
        );


    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                /* Remove active */

                filters.forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });


                /* Add active */

                filter.classList.add(
                    "active"
                );


                const selectedFilter =
                    filter.dataset.filter;


                if (
                    selectedFilter === "all"
                ) {

                    displayServices(
                        allBookings
                    );

                    return;
                }


                const filteredBookings =
                    allBookings.filter(
                        booking =>
                            booking.status ===
                            selectedFilter
                    );


                displayServices(
                    filteredBookings
                );

            }
        );

    });

}


/* ==============================
   STATUS CLASS
================================ */

function getStatusClass(status) {

    if (!status) {
        return "pending";
    }


    switch (
        status.toLowerCase()
    ) {

        case "pending":
            return "pending";


        case "technician assigned":
            return "assigned";


        case "service in progress":
            return "progress";


        case "completed":
            return "completed";


        case "cancelled":
            return "cancelled";


        default:
            return "pending";

    }

}


/* ==============================
   STATUS ICON
================================ */

function getStatusIcon(status) {

    if (!status) {
        return "⏳";
    }


    switch (
        status.toLowerCase()
    ) {

        case "pending":
            return "⏳";


        case "technician assigned":
            return "👨‍🔧";


        case "service in progress":
            return "🔧";


        case "completed":
            return "✓";


        case "cancelled":
            return "✕";


        default:
            return "⏳";

    }

}


/* ==============================
   FOOTER MESSAGE
================================ */

function getFooterMessage(status) {

    if (!status) {
        return "Booking pending";
    }


    switch (
        status.toLowerCase()
    ) {

        case "pending":
            return "Waiting for technician assignment";


        case "technician assigned":
            return "Technician assigned successfully";


        case "service in progress":
            return "Technician is currently working on your service";


        case "completed":
            return "Service completed successfully";


        case "cancelled":
            return "This service has been cancelled";


        default:
            return "Service information";

    }

}


/* ==============================
   FOOTER CLASS
================================ */

function getFooterClass(status) {

    if (!status) {
        return "";
    }


    switch (
        status.toLowerCase()
    ) {

        case "completed":
            return "completed-text";


        case "cancelled":
            return "cancelled-text";


        case "technician assigned":
            return "assigned-text";


        case "service in progress":
            return "progress-text";


        default:
            return "";

    }

}


/* ==============================
   PAYMENT CLASS
================================ */

function getPaymentClass(paymentStatus) {

    if (!paymentStatus) {
        return "payment-pending";
    }


    switch (
        paymentStatus.toLowerCase()
    ) {

        case "paid":
            return "paid";


        case "failed":
            return "payment-failed";


        case "pending":
            return "payment-pending";


        default:
            return "payment-pending";

    }

}


/* ==============================
   PAYMENT ICON
================================ */

function getPaymentIcon(paymentStatus) {

    if (!paymentStatus) {
        return "";
    }


    switch (
        paymentStatus.toLowerCase()
    ) {

        case "paid":
            return "✓";


        case "failed":
            return "✕";


        default:
            return "";

    }

}


/* ==============================
   VIEW DETAILS
================================ */

async function viewServiceDetails(
    bookingId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/${bookingId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load service details."
            );

        }


        const booking =
            await response.json();


        const technician =
            booking.technicianName
                ? booking.technicianName
                : "Not Assigned";


        const payment =
            booking.paymentAmount !== null &&
            booking.paymentAmount !== undefined
                ? `₹${booking.paymentAmount}`
                : "Not Available";


        const visitedTime =
            booking.visitedStartTime &&
            booking.visitedEndTime
                ? `${booking.visitedStartTime} - ${booking.visitedEndTime}`
                : "Not Visited Yet";


        alert(

`HomeFix Service Details

Booking ID: #${booking.id}

Service: ${booking.service || "Not Available"}

Appliance: ${booking.appliance || "Not Available"}

Service Date: ${booking.bookingDate || "Not Available"}

Status: ${booking.status || "Pending"}

Technician: ${technician}

Technician Phone: ${booking.technicianPhone || "Not Available"}

Visited Time: ${visitedTime}

Payment: ${payment}

Payment Status: ${booking.paymentStatus || "Pending"}`

        );


    } catch (error) {

        console.error(
            "Details error:",
            error
        );


        alert(
            "Unable to load service details."
        );

    }

}


/* ==============================
   ERROR MESSAGE
================================ */

function showError(message) {

    const container =
        document.getElementById(
            "servicesContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="error-message">

            <h3>
                ⚠ Unable to Load Services
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;


}


/* ==============================
   HTML SAFETY
================================ */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
