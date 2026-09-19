/* =========================================
   HOMEFIX LOGIN JAVASCRIPT
   BACKEND CONNECTED VERSION
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       GET HTML ELEMENTS
       ========================================= */

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const loginMessage =
        document.getElementById("loginMessage");

    const togglePassword =
        document.getElementById("togglePassword");

    const rememberMe =
        document.getElementById("rememberMe");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const loginBtn =
        document.getElementById("loginBtn");


    /* =========================================
       CHECK REQUIRED ELEMENTS
       ========================================= */

    if (!loginForm) {
        console.error("loginForm not found");
        return;
    }


    /* =========================================
       LOAD REMEMBERED EMAIL
       ========================================= */

    const savedEmail =
        localStorage.getItem("homefixEmail");

    if (
        savedEmail &&
        emailInput &&
        rememberMe
    ) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }


    /* =========================================
       SHOW / HIDE PASSWORD
       ========================================= */

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (
                    passwordInput.type === "password"
                ) {

                    passwordInput.type = "text";

                    togglePassword.textContent =
                        "Hide";

                } else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "Show";
                }
            }
        );
    }


    /* =========================================
       EMAIL VALIDATION
       ========================================= */

    function validateEmail() {

        const email =
            emailInput.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (email === "") {

            emailError.textContent =
                "Email address is required.";

            emailInput.classList.add(
                "input-error"
            );

            emailInput.classList.remove(
                "input-success"
            );

            return false;
        }


        if (!emailPattern.test(email)) {

            emailError.textContent =
                "Please enter a valid email address.";

            emailInput.classList.add(
                "input-error"
            );

            emailInput.classList.remove(
                "input-success"
            );

            return false;
        }


        emailError.textContent = "";

        emailInput.classList.remove(
            "input-error"
        );

        emailInput.classList.add(
            "input-success"
        );

        return true;
    }


    /* =========================================
       PASSWORD VALIDATION
       ========================================= */

    function validatePassword() {

        const password =
            passwordInput.value;


        if (password === "") {

            passwordError.textContent =
                "Password is required.";

            passwordInput.classList.add(
                "input-error"
            );

            passwordInput.classList.remove(
                "input-success"
            );

            return false;
        }


        passwordError.textContent = "";

        passwordInput.classList.remove(
            "input-error"
        );

        passwordInput.classList.add(
            "input-success"
        );

        return true;
    }


    /* =========================================
       REAL-TIME VALIDATION
       ========================================= */

    emailInput.addEventListener(
        "blur",
        validateEmail
    );


    passwordInput.addEventListener(
        "blur",
        validatePassword
    );


    emailInput.addEventListener(
        "input",
        function () {

            emailError.textContent = "";

            emailInput.classList.remove(
                "input-error"
            );
        }
    );


    passwordInput.addEventListener(
        "input",
        function () {

            passwordError.textContent = "";

            passwordInput.classList.remove(
                "input-error"
            );
        }
    );


    /* =========================================
       LOGIN
       ========================================= */

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            loginMessage.textContent = "";


            /* =================================
               VALIDATE
               ================================= */

            const validEmail =
                validateEmail();

            const validPassword =
                validatePassword();


            if (
                !validEmail ||
                !validPassword
            ) {

                loginMessage.textContent =
                    "Please correct the errors above.";

                loginMessage.style.color =
                    "#e53935";

                return;
            }


            /* =================================
               GET VALUES
               ================================= */

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /* =================================
               DISABLE BUTTON
               ================================= */

            loginBtn.disabled = true;

            loginBtn.textContent =
                "Logging in...";


            try {

                /* =================================
                   SEND LOGIN REQUEST
                   ================================= */

                const response =
                    await fetch(
                        "http://localhost:8080/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email: email,
                                    password: password
                                })
                        }
                    );


                /* =================================
                   READ RESPONSE
                   ================================= */

                const data =
                    await response.json();


                console.log(
                    "LOGIN RESPONSE:",
                    data
                );


                /* =================================
                   LOGIN SUCCESS
                   ================================= */

                if (response.ok) {


                    /* =============================
                       SAVE LOGIN SESSION
                       ============================= */

                    localStorage.setItem(
                        "homefixLoggedIn",
                        "true"
                    );


                    /* =============================
                       SAVE COMPLETE USER
                       ============================= */

                    localStorage.setItem(
                        "homefixUser",
                        JSON.stringify(data)
                    );


                    /* =============================
                       SAVE USER ID
                       ============================= */

                    if (data.id) {

                        localStorage.setItem(
                            "userId",
                            data.id
                        );

                        console.log(
                            "USER ID SAVED:",
                            data.id
                        );

                    } else {

                        console.warn(
                            "User ID not found in login response."
                        );
                    }


                    /* =============================
                       SAVE EMAIL
                       ============================= */

                    if (
                        rememberMe &&
                        rememberMe.checked
                    ) {

                        localStorage.setItem(
                            "homefixEmail",
                            email
                        );

                    } else {

                        localStorage.removeItem(
                            "homefixEmail"
                        );
                    }


                    /* =============================
                       SUCCESS MESSAGE
                       ============================= */

                    loginMessage.textContent =
                        "Login successful!";

                    loginMessage.style.color =
                        "#2e9d68";


                    /* =============================
                       REDIRECT
                       ============================= */

                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        500
                    );


                } else {


                    /* =================================
                       LOGIN FAILED
                       ================================= */

                    loginMessage.textContent =
                        data.message ||
                        "Invalid email or password.";

                    loginMessage.style.color =
                        "#e53935";


                    passwordInput.value = "";

                    passwordInput.classList.add(
                        "input-error"
                    );
                }


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                loginMessage.textContent =
                    "Cannot connect to backend.";

                loginMessage.style.color =
                    "#e53935";

            }


            /* =================================
               ENABLE BUTTON
               ================================= */

            finally {

                loginBtn.disabled = false;

                loginBtn.textContent =
                    "Login";
            }
        }
    );


    /* =========================================
       FORGOT PASSWORD
       ========================================= */

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                window.location.href =
                    "forgot-password.html";
            }
        );
    }


    /* =========================================
       ENTER KEY
       ========================================= */

    passwordInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                loginForm.requestSubmit();
            }
        }
    );

});