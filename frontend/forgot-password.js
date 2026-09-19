document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message");

        if (email === "") {
            message.textContent =
                "Please enter your email.";
            return;
        }

        message.textContent =
            "Sending reset link...";

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            const result =
                await response.text();

            if (response.ok) {

                message.textContent =
                    "Password reset link has been sent to your email.";

            } else {

                message.textContent =
                    result;
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";
        }
    });