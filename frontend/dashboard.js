// ==========================================
// HOMEFIX DASHBOARD
// ==========================================

const API_URL = "http://localhost:8080/api/bookings";

let bookings = [];


// ==========================================
// SERVICE IMAGES
// ==========================================

const serviceImages = {

    "AC Repair":
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",

    "Installation":
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"

};


// ==========================================
// LOAD BOOKINGS
// ==========================================

async function loadDashboard() {

    try {

        // Get logged-in user
        const savedUser =
            localStorage.getItem("homefixUser");

        if (!savedUser) {

            alert("Please login first.");

            window.location.href = "login.html";

            return;
        }


        const user =
            JSON.parse(savedUser);

        console.log("Logged-in user:", user);


        const userId =
            user.id;


        if (!userId) {

            throw new Error(
                "User ID is missing from login."
            );
        }


        console.log(
            "Loading bookings for User ID:",
            userId
        );


        // Get all bookings from backend
        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );
        }


        const allBookings =
            await response.json();


        console.log(
            "All bookings:",
            allBookings
        );


        // ======================================
        // SHOW ONLY LOGGED-IN USER BOOKINGS
        // ======================================

        bookings =
            allBookings.filter(
                booking =>
                    Number(booking.userId) ===
                    Number(userId)
            );


        console.log(
            "My bookings:",
            bookings
        );


        // Update dashboard
        updateStatistics();

        displayNextAppointment();

        displayRecentAppointments();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        document.getElementById(
            "nextAppointment"
        ).innerHTML = `

            <div class="empty">

                <h3>
                    Unable to load appointments
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;


        document.getElementById(
            "recentAppointments"
        ).innerHTML = `

            <div class="empty">

                <p>
                    Could not load appointments.
                </p>

            </div>

        `;
    }
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        bookings.length;


    const pending =
        bookings.filter(
            booking =>
                booking.status?.toLowerCase() ===
                "pending"
        ).length;


    const completed =
        bookings.filter(
            booking =>
                booking.status?.toLowerCase() ===
                "completed"
        ).length;


    const cancelled =
        bookings.filter(
            booking => {

                const status =
                    booking.status?.toLowerCase();

                return (
                    status === "cancelled" ||
                    status === "canceled"
                );

            }
        ).length;


    console.log("Statistics:");
    console.log("Total:", total);
    console.log("Pending:", pending);
    console.log("Completed:", completed);
    console.log("Cancelled:", cancelled);


    const totalElement =
        document.getElementById(
            "totalBookings"
        );

    const pendingElement =
        document.getElementById(
            "pendingBookings"
        );

    const completedElement =
        document.getElementById(
            "completedBookings"
        );

    const cancelledElement =
        document.getElementById(
            "cancelledBookings"
        );


    if (totalElement) {

        totalElement.textContent =
            total;
    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;
    }


    if (completedElement) {

        completedElement.textContent =
            completed;
    }


    if (cancelledElement) {

        cancelledElement.textContent =
            cancelled;
    }
}


// ==========================================
// GET IMAGE
// ==========================================

function getServiceImage(booking) {

    if (
        booking.service ===
        "AC Repair"
    ) {

        return serviceImages["AC Repair"];
    }


    if (
        booking.appliance ===
        "Television"
    ) {

        return serviceImages["Installation"];
    }


    return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
}


// ==========================================
// DISPLAY NEXT APPOINTMENT
// ==========================================

function displayNextAppointment() {

    const container =
        document.getElementById(
            "nextAppointment"
        );


    if (!container) {
        return;
    }


    const upcoming =
        bookings
            .filter(
                booking =>
                    booking.status?.toLowerCase() ===
                    "pending"
            )
            .sort(
                (a, b) =>
                    new Date(a.bookingDate) -
                    new Date(b.bookingDate)
            );


    if (upcoming.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <h3>
                    No Upcoming Appointment
                </h3>

                <p>
                    Book a service to get started.
                </p>

            </div>

        `;

        return;
    }


    const booking =
        upcoming[0];


    const image =
        getServiceImage(booking);


    container.innerHTML = `

        <div class="next-card">

            <img
                src="${image}"
                class="next-image"
                alt="${booking.appliance}"
            >

            <div class="next-details">

                <h3>
                    ${booking.appliance}
                </h3>

                <p>
                    🔧
                    <strong>Service:</strong>
                    ${booking.service}
                </p>

                <p>
                    📅
                    <strong>Date:</strong>
                    ${formatDate(
                        booking.bookingDate
                    )}
                </p>

                <p>
                    🆔
                    <strong>Booking ID:</strong>
                    #${booking.id}
                </p>

                <span class="status pending">
                    ${booking.status}
                </span>

            </div>

        </div>

    `;
}


// ==========================================
// RECENT APPOINTMENTS
// ==========================================

function displayRecentAppointments() {

    const container =
        document.getElementById(
            "recentAppointments"
        );


    if (!container) {
        return;
    }


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <h3>
                    No Appointments
                </h3>

                <p>
                    You haven't booked a service yet.
                </p>

            </div>

        `;

        return;
    }


    const recent =
        [...bookings]
            .sort(
                (a, b) =>
                    new Date(b.bookingDate) -
                    new Date(a.bookingDate)
            )
            .slice(0, 5);


    container.innerHTML = "";


    recent.forEach(
        booking => {

            const image =
                getServiceImage(booking);


            const status =
                booking.status ||
                "Pending";


            const statusClass =
                getStatusClass(status);


            container.innerHTML += `

                <div class="recent-card">

                    <img
                        src="${image}"
                        class="recent-image"
                        alt="${booking.appliance}"
                    >

                    <div class="recent-details">

                        <h3>
                            ${booking.appliance}
                        </h3>

                        <p>
                            🔧 ${booking.service}
                        </p>

                        <p>
                            📅
                            ${formatDate(
                                booking.bookingDate
                            )}
                        </p>

                    </div>

                    <span
                        class="status ${statusClass}"
                    >
                        ${status}
                    </span>

                </div>

            `;
        }
    );
}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

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
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "homefixUser"
    );

    localStorage.removeItem(
        "userId"
    );

    localStorage.removeItem(
        "homefixLoggedIn"
    );


    window.location.href =
        "login.html";
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);