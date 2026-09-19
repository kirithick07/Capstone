
const API_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("technicianLoginForm");
    const technicianIdInput = document.getElementById("technicianId");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");

    if (!form || !technicianIdInput || !passwordInput || !message) {
        console.error("Technician login elements not found.");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const technicianId =
            technicianIdInput.value.trim();

        const password =
            passwordInput.value.trim();

        if (technicianId === "" || password === "") {
            message.textContent =
                "Please enter Technician ID and password.";
            return;
        }

        const id = parseInt(technicianId, 10);

        if (isNaN(id) || id <= 0) {
            message.textContent =
                "Please enter a valid Technician ID.";
            return;
        }

        const loginData = {
            id: id,
            password: password
        };

        console.log("Sending:", loginData);

        message.textContent = "Logging in...";

        try {

            const response = await fetch(
                API_URL + "/technicians/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(loginData)
                }
            );

            const responseText =
                await response.text();

            console.log(
                "Status:",
                response.status
            );

            console.log(
                "Response:",
                responseText
            );

            if (!response.ok) {
                message.textContent =
                    responseText ||
                    "Invalid Technician ID or password.";

                return;
            }

            let technician;

            try {
                technician =
                    JSON.parse(responseText);
            } catch (error) {
                console.error(
                    "JSON parsing error:",
                    error
                );

                message.textContent =
                    "Invalid server response.";

                return;
            }

            // Save technician login
            localStorage.setItem(
                "technicianId",
                technician.id
            );

            localStorage.setItem(
                "technicianName",
                technician.name
            );

            localStorage.setItem(
                "technicianLoggedIn",
                "true"
            );

            message.textContent =
                "Login successful!";

            // Redirect after successful login
            setTimeout(function () {

                window.location.href =
                    "technician-dashboard.html";

            }, 500);

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            message.textContent =
                "Unable to connect to HomeFix server.";
        }
    });
});

