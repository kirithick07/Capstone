const API_URL = "https://homefix-backend-2q2l.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    const adminId = localStorage.getItem("adminId");
    const adminName = localStorage.getItem("adminName");

    // Protect admin dashboard
    if (!adminId) {
        window.location.href = "admin-login.html";
        return;
    }

    document.getElementById("adminName").textContent =
        adminName || "Admin";

    loadBookings();

    document.getElementById("logoutBtn").addEventListener("click", () => {

        localStorage.removeItem("adminId");
        localStorage.removeItem("adminUsername");
        localStorage.removeItem("adminName");

        window.location.href = "admin-login.html";
    });
});


async function loadBookings() {

    try {

        const response = await fetch(`${API_URL}/api/bookings`);

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        const bookings = await response.json();

        updateStatistics(bookings);
        displayBookings(bookings);

    } catch (error) {

        console.error("Error loading bookings:", error);

        document.getElementById("bookingContainer").innerHTML =
            "<p>Unable to load bookings.</p>";
    }
}


function updateStatistics(bookings) {

    let pending = 0;
    let assigned = 0;
    let progress = 0;
    let completed = 0;

    bookings.forEach(booking => {

        const status = (booking.status || "").toLowerCase();

        if (status === "pending") {
            pending++;
        }

        else if (status === "technician assigned") {
            assigned++;
        }

        else if (status === "service in progress") {
            progress++;
        }

        else if (status === "completed") {
            completed++;
        }
    });

    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("assignedCount").textContent = assigned;
    document.getElementById("progressCount").textContent = progress;
    document.getElementById("completedCount").textContent = completed;
}


function displayBookings(bookings) {

    const container = document.getElementById("bookingContainer");

    if (!bookings || bookings.length === 0) {
        container.innerHTML = "<p>No bookings found.</p>";
        return;
    }

    container.innerHTML = "";

    bookings.forEach(booking => {

        const card = document.createElement("div");

        card.className = "booking-card";

        card.innerHTML = `
            <h3>Booking #${booking.id}</h3>

            <p><strong>Appliance:</strong> ${booking.appliance || "-"}</p>

            <p><strong>Service:</strong> ${booking.service || "-"}</p>

            <p><strong>Date:</strong> ${booking.bookingDate || "-"}</p>

            <p><strong>Status:</strong> ${booking.status || "-"}</p>

            <p>
                <strong>Technician:</strong>
                ${booking.technicianName || "Not Assigned"}
            </p>

            <div class="booking-actions">

                <select id="technician-${booking.id}">
                    <option value="">Select Technician</option>
                </select>

                <button
                    class="assign-btn"
                    onclick="assignTechnician(${booking.id})">
                    Assign Technician
                </button>

            </div>
        `;

        container.appendChild(card);

        loadTechnicians(booking.id);
    });
}


async function loadTechnicians(bookingId) {

    try {

        const response = await fetch(`${API_URL}/api/technicians`);

        if (!response.ok) {
            throw new Error("Failed to load technicians");
        }

        const technicians = await response.json();

        const select =
            document.getElementById(`technician-${bookingId}`);

        if (!select) return;

        technicians.forEach(technician => {

            if (technician.available) {

                const option = document.createElement("option");

                option.value = technician.id;

                option.textContent =
                    `${technician.name} - ${technician.specialization || "General"}`;

                select.appendChild(option);
            }
        });

    } catch (error) {

        console.error("Error loading technicians:", error);
    }
}


async function assignTechnician(bookingId) {

    const select =
        document.getElementById(`technician-${bookingId}`);

    const technicianId = select.value;

    if (!technicianId) {
        alert("Please select a technician.");
        return;
    }

    try {

        const response = await fetch(
           `${API_URL}/api/bookings/${bookingId}/assign-technician/${technicianId}`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {

            const error = await response.text();

            alert(error || "Unable to assign technician.");
            return;
        }

        alert("Technician assigned successfully.");

        loadBookings();

    } catch (error) {

        console.error("Assignment error:", error);

        alert("Unable to connect to server.");
    }
}