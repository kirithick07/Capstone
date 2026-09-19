
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


// =========================================
// OTP ELEMENTS
// =========================================

const otpSection =
    document.getElementById("otpSection");

const otpInput =
    document.getElementById("otp");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");

const resendOtpButton =
    document.getElementById("resendOtpButton");

const otpMessage =
    document.getElementById("otpMessage");


// Store email used for OTP
let registeredEmail = "";


// =========================================
// SHOW PASSWORD
// =========================================

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "🙈";

    } else {

        password.type = "password";

        togglePassword.textContent = "👁";
    }

});


// =========================================
// SHOW CONFIRM PASSWORD
// =========================================

toggleConfirmPassword.addEventListener(
    "click",
    function () {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            toggleConfirmPassword.textContent = "🙈";

        } else {

            confirmPassword.type = "password";

            toggleConfirmPassword.textContent = "👁";
        }

    }
);


// =========================================
// PHONE ONLY NUMBERS
// =========================================

phone.addEventListener("input", function () {

    phone.value =
        phone.value.replace(/\D/g, "");

});


// =========================================
// OTP ONLY NUMBERS
// =========================================

otpInput.addEventListener("input", function () {

    otpInput.value =
        otpInput.value.replace(/\D/g, "");

});


// =========================================
// REGISTER / SEND OTP
// =========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const fullname =
            document
                .getElementById("fullname")
                .value
                .trim();


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const phoneNumber =
            document
                .getElementById("phone")
                .value
                .trim();


        const passwordValue =
            password.value;


        const confirmPasswordValue =
            confirmPassword.value;


        const terms =
            document
                .getElementById("terms")
                .checked;


        // =====================================
        // VALIDATE NAME
        // =====================================

        if (fullname.length < 3) {

            message.textContent =
                "Enter your full name.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // VALIDATE USERNAME
        // =====================================

        if (username.length < 3) {

            message.textContent =
                "Username must contain at least 3 characters.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // VALIDATE EMAIL
        // =====================================

        if (!email.includes("@")) {

            message.textContent =
                "Enter a valid email.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // VALIDATE PHONE
        // =====================================

        if (phoneNumber.length !== 10) {

            message.textContent =
                "Enter a valid 10-digit mobile number.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // VALIDATE PASSWORD
        // =====================================

        if (passwordValue.length < 8) {

            message.textContent =
                "Password must contain at least 8 characters.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // CONFIRM PASSWORD
        // =====================================

        if (passwordValue !== confirmPasswordValue) {

            message.textContent =
                "Passwords do not match.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // TERMS
        // =====================================

        if (!terms) {

            message.textContent =
                "Please accept the Terms & Conditions.";

            message.style.color = "red";

            return;
        }


        // =====================================
        // USER DATA
        // =====================================

        const user = {

            name: fullname,

            username: username,

            email: email,

            password: passwordValue,

            phone: phoneNumber

        };


        console.log(
            "Sending registration data:",
            user
        );


        // =====================================
        // SEND DATA TO SPRING BOOT
        // =====================================

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(user)
                    }
                );


            // =================================
            // BACKEND ERROR
            // =================================

            if (!response.ok) {

                const errorText =
                    await response.text();

                message.textContent =
                    errorText ||
                    "Registration failed.";

                message.style.color = "red";

                return;
            }


            // =================================
            // REGISTRATION REQUEST SUCCESS
            // =================================

            const data =
                await response.json();

            console.log(
                "Registration response:",
                data
            );


            // Save email for OTP verification
            registeredEmail = email;


            message.textContent =
                "OTP sent to your email.";

            message.style.color = "green";


            // Hide registration form
            form.style.display = "none";


            // Show OTP section
            otpSection.style.display = "block";


            // Clear OTP field
            otpInput.value = "";


            // Focus OTP field
            otpInput.focus();


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            message.textContent =
                "Cannot connect to the backend.";

            message.style.color = "red";
        }

    }
);


// =========================================
// VERIFY OTP
// =========================================

verifyOtpButton.addEventListener(
    "click",
    async function () {

        const code =
            otpInput.value.trim();


        // =====================================
        // VALIDATE OTP
        // =====================================

        if (code.length !== 6) {

            otpMessage.textContent =
                "Enter the 6-digit OTP.";

            otpMessage.style.color = "red";

            return;
        }


        if (!registeredEmail) {

            otpMessage.textContent =
                "Registration email not found.";

            otpMessage.style.color = "red";

            return;
        }


        // Disable button
        verifyOtpButton.disabled = true;

        verifyOtpButton.textContent =
            "Verifying...";


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/auth/verify-code",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email: registeredEmail,
                                code: code
                            })
                    }
                );


            const result =
                await response.text();


            // =================================
            // VERIFICATION FAILED
            // =================================

            if (!response.ok) {

                otpMessage.textContent =
                    result ||
                    "Invalid or expired OTP.";

                otpMessage.style.color =
                    "red";

                verifyOtpButton.disabled =
                    false;

                verifyOtpButton.textContent =
                    "Verify OTP";

                return;
            }


            // =================================
            // SUCCESS
            // =================================

           // =================================
// SUCCESS
// =================================

otpMessage.textContent =
    "Account created successfully!";

otpMessage.style.color =
    "green";

verifyOtpButton.textContent =
    "Verified";

// =================================
// CLEAR OLD LOGIN SESSION
// =================================

localStorage.removeItem("userId");
localStorage.removeItem("username");
localStorage.removeItem("email");
localStorage.removeItem("name");

// Redirect to login
setTimeout(function () {

    window.location.href =
        "login.html";

}, 1500);


        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );


            otpMessage.textContent =
                "Cannot connect to the backend.";

            otpMessage.style.color =
                "red";


            verifyOtpButton.disabled =
                false;

            verifyOtpButton.textContent =
                "Verify OTP";
        }

    }
);


// =========================================
// RESEND OTP
// =========================================

resendOtpButton.addEventListener(
    "click",
    async function () {

        if (!registeredEmail) {

            otpMessage.textContent =
                "Registration email not found.";

            otpMessage.style.color =
                "red";

            return;
        }


        resendOtpButton.disabled = true;

        resendOtpButton.textContent =
            "Sending...";


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/auth/send-code",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email: registeredEmail
                            })
                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                otpMessage.textContent =
                    result ||
                    "Could not resend OTP.";

                otpMessage.style.color =
                    "red";

                resendOtpButton.disabled =
                    false;

                resendOtpButton.textContent =
                    "Resend OTP";

                return;
            }


            // =================================
            // RESEND SUCCESS
            // =================================

            otpMessage.textContent =
                "A new OTP has been sent to your email.";

            otpMessage.style.color =
                "green";


            otpInput.value = "";

            otpInput.focus();


            resendOtpButton.disabled =
                false;

            resendOtpButton.textContent =
                "Resend OTP";


        } catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );


            otpMessage.textContent =
                "Cannot connect to the backend.";

            otpMessage.style.color =
                "red";


            resendOtpButton.disabled =
                false;

            resendOtpButton.textContent =
                "Resend OTP";
        }

    }
);

