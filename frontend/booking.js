
/* =========================================
   HOMEFIX BOOKING JAVASCRIPT
   BACKEND CONNECTED VERSION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================= */

    const bookingForm =
        document.getElementById("bookingForm");

    const serviceType =
        document.getElementById("serviceType");

    const serviceDate =
        document.getElementById("serviceDate");

    const serviceTime =
        document.getElementById("serviceTime");

    const summaryAppliance =
        document.getElementById("summaryAppliance");

    const summaryService =
        document.getElementById("summaryService");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryTime =
        document.getElementById("summaryTime");

    const price =
        document.getElementById("price");

    const bookingMessage =
        document.getElementById("bookingMessage");

    const successOverlay =
        document.getElementById("successOverlay");

    const successDashboardBtn =
        document.getElementById("successDashboardBtn");

    const bookingId =
        document.getElementById("bookingId");


    /* =========================================
       CHECK REQUIRED ELEMENTS
    ========================================= */

    if (!bookingForm) {
        console.error("bookingForm not found");
        return;
    }

    if (!serviceType) {
        console.error("serviceType not found");
        return;
    }

    if (!serviceDate) {
        console.error("serviceDate not found");
        return;
    }

    if (!serviceTime) {
        console.error("serviceTime not found");
        return;
    }


    /* =========================================
       GET LOGGED-IN USER
    ========================================= */

    /*
     * login.js stores the user using:
     *
     * localStorage.setItem(
     *     "homefixUser",
     *     JSON.stringify(data)
     * );
     */

    const storedUser =
        localStorage.getItem("homefixUser");


    console.log(
        "Stored HomeFix User:",
        storedUser
    );


    /* =========================================
       CHECK LOGIN
    ========================================= */

    if (!storedUser) {

        alert(
            "Please login before booking a service."
        );

        window.location.href =
            "login.html";

        return;
    }


    /* =========================================
       READ USER DATA
    ========================================= */

    let user;

    try {

        user =
            JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        localStorage.removeItem(
            "homefixUser"
        );

        localStorage.removeItem(
            "homefixLoggedIn"
        );

        alert(
            "Login session is invalid. Please login again."
        );

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "Logged-in user:",
        user
    );


    /* =========================================
       GET USER ID
    ========================================= */

    /*
     * Supports both:
     *
     * user.id
     * user.userId
     */

    const userId =
        user.id ?? user.userId;


    console.log(
        "User ID:",
        userId
    );


    /* =========================================
       CHECK USER ID
    ========================================= */

    if (!userId) {

        console.error(
            "User ID not found in login response:",
            user
        );

        alert(
            "User ID not found. Please login again."
        );

        return;
    }


    /* =========================================
       SET MINIMUM DATE
       PREVENT PAST DATES
    ========================================= */

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    const todayString =
        `${year}-${month}-${day}`;

    serviceDate.min =
        todayString;


    /* =========================================
       APPLIANCE SELECTION
    ========================================= */

    const applianceOptions =
        document.querySelectorAll(
            'input[name="appliance"]'
        );


    applianceOptions.forEach(
        function (option) {

            option.addEventListener(
                "change",
                function () {

                    summaryAppliance.textContent =
                        option.value;


                    /* =========================
                       CARD ANIMATION
                    ========================= */

                    const card =
                        option.nextElementSibling;


                    if (card) {

                        card.animate(
                            [
                                {
                                    transform:
                                        "scale(0.95)"
                                },

                                {
                                    transform:
                                        "scale(1.03)"
                                },

                                {
                                    transform:
                                        "scale(1)"
                                }
                            ],
                            {
                                duration: 350,
                                easing: "ease-out"
                            }
                        );

                    }

                }
            );

        }
    );


    /* =========================================
       SERVICE SELECTION
    ========================================= */

    serviceType.addEventListener(
        "change",
        function () {

            const selected =
                serviceType.options[
                    serviceType.selectedIndex
                ];


            if (!selected.value) {

                summaryService.textContent =
                    "Not selected";

                price.textContent =
                    "0";

                return;
            }


            summaryService.textContent =
                selected.value;


            const servicePrice =
                selected.getAttribute(
                    "data-price"
                );


            price.textContent =
                servicePrice || "0";

        }
    );


    /* =========================================
       DATE SELECTION
    ========================================= */

    serviceDate.addEventListener(
        "change",
        function () {

            if (!serviceDate.value) {

                summaryDate.textContent =
                    "Not selected";

                return;
            }


            const selectedDate =
                new Date(
                    serviceDate.value +
                    "T00:00:00"
                );


            const formattedDate =
                selectedDate.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            summaryDate.textContent =
                formattedDate;

        }
    );


    /* =========================================
       TIME SELECTION
    ========================================= */

    serviceTime.addEventListener(
        "change",
        function () {

            if (!serviceTime.value) {

                summaryTime.textContent =
                    "Not selected";

                return;
            }


            summaryTime.textContent =
                serviceTime.value;

        }
    );


    /* =========================================
       FORM SUBMIT
    ========================================= */

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* Clear old message */

            bookingMessage.textContent =
                "";


            /* =================================
               GET SELECTED APPLIANCE
            ================================= */

            const selectedAppliance =
                document.querySelector(
                    'input[name="appliance"]:checked'
                );


            /* =================================
               VALIDATION
            ================================= */

            if (!selectedAppliance) {

                bookingMessage.textContent =
                    "Please select an appliance.";

                return;
            }


            if (!serviceType.value) {

                bookingMessage.textContent =
                    "Please select a service type.";

                return;
            }


            if (!serviceDate.value) {

                bookingMessage.textContent =
                    "Please select a service date.";

                return;
            }


            if (!serviceTime.value) {

                bookingMessage.textContent =
                    "Please select a preferred time.";

                return;
            }


            /* =================================
               PINCODE
            ================================= */

            const pincodeElement =
                document.getElementById(
                    "pincode"
                );


            const pincode =
                pincodeElement
                    ? pincodeElement.value.trim()
                    : "";


            if (
                pincode &&
                !/^[0-9]{6}$/.test(pincode)
            ) {

                bookingMessage.textContent =
                    "Please enter a valid 6-digit PIN code.";

                return;
            }


            /* =================================
               GET OTHER FORM DATA
            ================================= */

            const addressElement =
                document.getElementById(
                    "address"
                );

            const cityElement =
                document.getElementById(
                    "city"
                );

            const problemElement =
                document.getElementById(
                    "problem"
                );


            const address =
                addressElement
                    ? addressElement.value.trim()
                    : "";


            const city =
                cityElement
                    ? cityElement.value.trim()
                    : "";


            const problem =
                problemElement
                    ? problemElement.value.trim()
                    : "";


            /* =================================
               CREATE BOOKING DATA
            ================================= */

            const bookingData = {

                userId:
                    Number(userId),

                appliance:
                    selectedAppliance.value,

                service:
                    serviceType.value,

                bookingDate:
                    serviceDate.value,

                status:
                    "Pending"
            };


            console.log(
                "Sending booking to backend:",
                bookingData
            );


            /* =================================
               DISABLE SUBMIT BUTTON
            ================================= */

            const submitButton =
                bookingForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Booking...";

            }


            /* =================================
               SEND BOOKING TO SPRING BOOT
            ================================= */

            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/bookings",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    bookingData
                                )
                        }
                    );


                /* =================================
                   READ RESPONSE
                ================================= */

                const responseText =
                    await response.text();


                console.log(
                    "Backend response:",
                    responseText
                );


                /* =================================
                   CHECK RESPONSE
                ================================= */

                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Booking could not be saved."
                    );
                }


                /* =================================
                   CONVERT RESPONSE TO JSON
                ================================= */

                const savedBooking =
                    JSON.parse(
                        responseText
                    );


                console.log(
                    "BOOKING SAVED SUCCESSFULLY:",
                    savedBooking
                );


                /* =================================
                   SHOW DATABASE BOOKING ID
                ================================= */

                if (bookingId) {

                    bookingId.textContent =
                        "Booking ID: " +
                        savedBooking.id;

                }


                /* =================================
                   SUCCESS MESSAGE
                ================================= */

                bookingMessage.textContent =
                    "";


                /* =================================
                   SHOW SUCCESS OVERLAY
                ================================= */

                if (successOverlay) {

                    successOverlay.classList.add(
                        "show"
                    );

                }


                /*
                 * IMPORTANT:
                 *
                 * We are NOT using localStorage
                 * to save the booking.
                 *
                 * Spring Boot has already saved
                 * it in MySQL.
                 */

            } catch (error) {

                console.error(
                    "BOOKING ERROR:",
                    error
                );


                bookingMessage.textContent =
                    "Unable to save booking. Please try again.";

            }


            /* =================================
               ENABLE BUTTON
            ================================= */

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Book Service";

            }

        }
    );


    /* =========================================
       GO TO DASHBOARD
    ========================================= */

    if (successDashboardBtn) {

        successDashboardBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "dashboard.html";

            }
        );

    }


});

