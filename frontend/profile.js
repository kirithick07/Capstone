const API_URL = "https://homefix-backend-2q2l.onrender.com/api/users";

document.addEventListener("DOMContentLoaded", function () {
    loadProfile();
});

async function loadProfile() {

    const savedUser = localStorage.getItem("homefixUser");

    if (!savedUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const user = JSON.parse(savedUser);

        console.log("Logged-in user:", user);

        const userId = user.id;

        if (!userId) {
            throw new Error("User ID is missing from login response.");
        }

        const response = await fetch(
            `${API_URL}/${userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Server returned status: " + response.status
            );
        }

        const latestUser = await response.json();

        console.log("User data from MySQL:", latestUser);

        displayProfile(latestUser);

    } catch (error) {

        console.error("PROFILE ERROR:", error);

        alert("Unable to load profile.");
    }
}


function displayProfile(user) {

    document.getElementById("profileName").textContent =
        user.name || "User";

    document.getElementById("profileUsername").textContent =
        "@" + (user.username || "username");

    document.getElementById("name").textContent =
        user.name || "Not available";

    document.getElementById("username").textContent =
        user.username || "Not available";

    document.getElementById("email").textContent =
        user.email || "Not available";

    document.getElementById("phone").textContent =
        user.phone || "Not available";


    const profileAvatar =
        document.getElementById("profileAvatar");

    const fullName = user.name || "User";

    profileAvatar.textContent =
        fullName.charAt(0).toUpperCase();
}


function goBack() {
    window.history.back();
}


function editProfile() {
    alert("Edit Profile feature will be added next.");
}
