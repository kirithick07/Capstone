const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    loadBookings();
});


async function loadBookings() {

    const container =
        document.getElementById("bookingsContainer");

    try {

        const bookingsResponse =
            await fetch(`${API_URL}/api/bookings`);

        if (!bookingsResponse.ok) {
            throw new Error("Unable to load bookings");
        }

        const bookings =
            await bookingsResponse.json();


        const techniciansResponse =
            await fetch(`${API_URL}/api/technicians/available`);

        if (!techniciansResponse.ok) {
            throw new Error("Unable to load technicians");
        }

        const technicians =
            await techniciansResponse.json();


        displayBookings(bookings, technicians);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error">
                Unable to load bookings.
            </div>
        `;
    }
}


function displayBookings(bookings, technicians) {

    const container =
        document.getElementById("bookingsContainer");

    container.innerHTML = "";


    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="no-bookings">
                No bookings found.
            </div>
        `;

        return;
    }


    bookings.forEach(booking => {

        const card =
            document.createElement("div");

        card.className = "booking-card";


        const statusClass =
            getStatusClass(booking.status);


        let technicianSection = "";


        if (booking.technicianName) {

            technicianSection = `
                <div class="assigned-technician">

                    <strong>
                        Technician Assigned
                    </strong>

                    <p>
                        ${booking.technicianName}
                    </p>

                    <p>
                        ${booking.technicianPhone || ""}
                    </p>

                </div>
            `;

        } else {

            const technicianOptions =
                technicians.map(technician => `
                    <option value="${technician.id}">
                        ${technician.name}
                        -
                        ${technician.specialization}
                    </option>
                `).join("");


            technicianSection = `
                <div class="assign-area">

                    <h3>Assign Technician</h3>

                    <div class="assign-row">

                        <select
                            class="technician-select"
                            id="technician-${booking.id}"
                        >

                            <option value="">
                                Select Technician
                            </option>

                            ${technicianOptions}

                        </select>


                        <button
                            class="assign-button"
                            onclick="assignTechnician(${booking.id})"
                        >
                            Assign
                        </button>

                    </div>

                </div>
            `;
        }


        card.innerHTML = `

            <div class="booking-top">

                <h2>
                    Booking #${booking.id}
                </h2>

                <span class="status ${statusClass}">
                    ${booking.status}
                </span>

            </div>


            <div class="booking-details">

                <div class="detail">
                    <span>Customer ID</span>
                    <strong>
                        ${booking.userId}
                    </strong>
                </div>


                <div class="detail">
                    <span>Appliance</span>
                    <strong>
                        ${booking.appliance}
                    </strong>
                </div>


                <div class="detail">
                    <span>Service</span>
                    <strong>
                        ${booking.service}
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
                    <span>Payment</span>
                    <strong>
                        ${booking.paymentAmount !== null
                            ? "₹" + booking.paymentAmount
                            : "Not Available"}
                    </strong>
                </div>

            </div>


            ${technicianSection}

        `;


        container.appendChild(card);

    });
}


async function assignTechnician(bookingId) {

    const select =
        document.getElementById(
            `technician-${bookingId}`
        );


    const technicianId =
        select.value;


    if (!technicianId) {

        alert("Please select a technician.");

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/bookings/${bookingId}/assign-technician/${technicianId}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const message =
                await response.text();

            alert(message);

            return;
        }


        alert(
            "Technician assigned successfully."
        );


        loadBookings();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to assign technician."
        );
    }
}


function getStatusClass(status) {

    if (!status) {
        return "pending";
    }

    const value =
        status.toLowerCase();

    if (value.includes("cancel")) {
        return "cancelled";
    }

    if (value.includes("complete")) {
        return "completed";
    }

    if (value.includes("assigned")) {
        return "assigned";
    }

    return "pending";
}