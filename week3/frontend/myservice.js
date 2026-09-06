
document.addEventListener("DOMContentLoaded", loadMyServices);

async function loadMyServices() {

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    const container = document.getElementById("servicesContainer");
    const noServices = document.getElementById("noServices");

    try {

        const userId = localStorage.getItem("userId") || 3;

        const response = await fetch(
            `http://localhost:8080/api/bookings/user/${userId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        const bookings = await response.json();

        loading.style.display = "none";

        if (!bookings || bookings.length === 0) {
            noServices.style.display = "block";
            return;
        }

        container.innerHTML = "";

        bookings.forEach(booking => {

            const image = getServiceImage(
                booking.service,
                booking.serviceType
            );

            const card = document.createElement("div");

            card.className = "service-card";

            card.innerHTML = `
                <img
                    src="${image}"
                    alt="${booking.serviceType}"
                    class="service-image"
                >

                <div class="service-content">

                    <h3>${booking.service}</h3>

                    <div class="service-info">
                        <strong>Booking ID:</strong>
                        ${booking.id}
                    </div>

                    <div class="service-info">
                        <strong>Date:</strong>
                        ${booking.bookingDate}
                    </div>

                    <div class="service-info">
                        <strong>Service Type:</strong>
                        ${booking.serviceType}
                    </div>

                    <span class="status">
                        ${booking.status}
                    </span>

                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {

        console.error(err);

        loading.style.display = "none";

        error.textContent =
            "Unable to load your services. Please check the backend.";

        error.style.display = "block";
    }
}


/* Select image based on service */
function getServiceImage(service, serviceType) {

    const type = (serviceType || "").toLowerCase();
    const name = (service || "").toLowerCase();

    /* AC Repair */
    if (
        type.includes("ac repair") ||
        type.includes("repair")
    ) {
        return "images/ac-repair.jpg";
    }

    /* AC Washing / Cleaning */
    if (
        type.includes("ac washing") ||
        type.includes("ac wash") ||
        type.includes("cleaning") ||
        type.includes("washing")
    ) {
        return "images/ac-washing.jpg";
    }

    /* Television Installation */
    if (
        name.includes("television") ||
        name.includes("tv") ||
        type.includes("tv installation") ||
        type.includes("installation")
    ) {
        return "images/tv-installation.jpg";
    }

    /* Refrigerator */
    if (
        name.includes("refrigerator") ||
        name.includes("fridge")
    ) {
        return "images/refrigerator.jpg";
    }

    /* Washing Machine */
    if (
        name.includes("washing machine")
    ) {
        return "images/washing-machine.jpg";
    }

    /* Default */
    return "images/default-service.jpg";
}

