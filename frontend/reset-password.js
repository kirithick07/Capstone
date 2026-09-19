const urlParams = new URLSearchParams(window.location.search);

const token = urlParams.get("token");

const form = document.getElementById("resetPasswordForm");
const message = document.getElementById("message");


// Check whether token exists
if (!token) {

    form.style.display = "none";

    message.textContent =
        "Invalid or missing password reset link.";
}


// Submit new password
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check passwords
    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    message.textContent =
        "Resetting password...";


    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/reset-password",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    token: token,
                    password: password
                })
            }
        );


        const result =
            await response.text();


        if (response.ok) {

            message.textContent =
                "Password reset successfully. Redirecting to login...";

            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

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