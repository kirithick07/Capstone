const form = document.getElementById("registerForm");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const message =
    document.getElementById("registerMessage");

const phone =
    document.getElementById("phone");


/* SHOW PASSWORD */

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁";
    }

});


/* SHOW CONFIRM PASSWORD */

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirmPassword.textContent = "🙈";
    } else {
        confirmPassword.type = "password";
        toggleConfirmPassword.textContent = "👁";
    }

});


/* PHONE ONLY NUMBERS */

phone.addEventListener("input", function () {

    phone.value = phone.value.replace(/\D/g, "");

});


/* REGISTER */

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const fullname =
        document.getElementById("fullname").value.trim();


    const username =
        document.getElementById("username").value.trim();


    const email =
        document.getElementById("email").value.trim();


    const phoneNumber =
        document.getElementById("phone").value.trim();


    const passwordValue =
        password.value;


    const confirmPasswordValue =
        confirmPassword.value;


    const terms =
        document.getElementById("terms").checked;


    /* VALIDATE NAME */

    if (fullname.length < 3) {

        message.textContent =
            "Enter your full name.";

        message.style.color = "red";

        return;
    }


    /* VALIDATE USERNAME */

    if (username.length < 3) {

        message.textContent =
            "Username must contain at least 3 characters.";

        message.style.color = "red";

        return;
    }


    /* VALIDATE EMAIL */

    if (!email.includes("@")) {

        message.textContent =
            "Enter a valid email.";

        message.style.color = "red";

        return;
    }


    /* VALIDATE PHONE */

    if (phoneNumber.length !== 10) {

        message.textContent =
            "Enter a valid 10-digit mobile number.";

        message.style.color = "red";

        return;
    }


    /* VALIDATE PASSWORD */

    if (passwordValue.length < 8) {

        message.textContent =
            "Password must contain at least 8 characters.";

        message.style.color = "red";

        return;
    }


    /* CONFIRM PASSWORD */

    if (passwordValue !== confirmPasswordValue) {

        message.textContent =
            "Passwords do not match.";

        message.style.color = "red";

        return;
    }


    /* TERMS */

    if (!terms) {

        message.textContent =
            "Please accept the Terms & Conditions.";

        message.style.color = "red";

        return;
    }


    /* USER DATA */

    const user = {

        name: fullname,

        username: username,

        email: email,

        password: passwordValue,

        phone: phoneNumber

    };


    console.log("Sending user data:", user);


    /* SEND DATA TO SPRING BOOT */

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)
            }
        );


        /* BACKEND ERROR */

        if (!response.ok) {

            const errorText =
                await response.text();

            message.textContent =
                errorText || "Registration failed.";

            message.style.color = "red";

            return;
        }


        /* SUCCESS */

        const data =
            await response.json();

        console.log(
            "Registered user:",
            data
        );


        message.textContent =
            "Account created successfully!";

        message.style.color = "green";


        /* REDIRECT TO LOGIN */

        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1000);


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        message.textContent =
            "Cannot connect to the backend.";

        message.style.color = "red";
    }

});