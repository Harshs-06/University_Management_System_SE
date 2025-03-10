document.addEventListener("DOMContentLoaded", function () {
    updateSections(); // Initialize sections on page load
});

function updateSections() {
    const department = document.getElementById("departmentDropdown").value;
    const sectionDropdown = document.getElementById("sectionDropdown");

    // Define section counts for each department
    const sections = {
        CSE: 7,
        ME: 3,
        Ecom: 2
    };

    sectionDropdown.innerHTML = ""; // Clear previous options

    for (let i = 1; i <= sections[department]; i++) {
        let option = document.createElement("option");
        option.value = `Section ${i}`;
        option.textContent = `Section ${i}`;
        sectionDropdown.appendChild(option);
    }

    updateDashboard();
}

function updateDashboard() {
    const department = document.getElementById("departmentDropdown").value;
    const section = document.getElementById("sectionDropdown").value;

    console.log(`Displaying dashboard for ${department} - ${section}`);
    // Implement logic to fetch and display data for selected section
}


let searchBar=document.querySelector("#searchBar");
searchBar.placeholder="Search"



let profile_userName = document.querySelector("#Profile_userName");
profile_userName.textContent="Veeneta Jamwal";

let profile_userDetail = document.querySelector("#Profile_userDetail");
profile_userDetail.textContent="SOET Admin";

let profile_pic = document.querySelector("#ProfilePic");
profile_pic.src="/assets/images/userProfilePic.png"
profile_pic.width="35";
profile_pic.height="35";

let settings_icon = document.querySelector("#settings_icon");
settings_icon.src="/assets/images/settings_icon.png"
settings_icon.width="24"
settings_icon.height="24"


let notification_icon = document.querySelector("#notification_icon");
notification_icon.src="/assets/images/notification_icon.png";
notification_icon.width="24"
notification_icon.height="24"

