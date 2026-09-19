const API_URL = "https://homefix-backend-2q2l.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("adminLoginForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        message.textContent = "Logging in...";

        try {

            const response = await fetch(`${API_URL}/api/admin/login`,  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                const error = await response.text();
                message.textContent = error || "Invalid username or password";
                return;
            }

            const admin = await response.json();

            localStorage.setItem("adminId", admin.id);
            localStorage.setItem("adminUsername", admin.username);
            localStorage.setItem("adminName", admin.name);

            message.textContent = "Login successful!";

            window.location.href = "admin-dashboard.html";

        } catch (error) {

            console.error("Admin login error:", error);
            message.textContent = "Unable to connect to server.";

        }
    });
});