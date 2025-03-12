let searchBar=document.querySelector(".searchBar");
searchBar.placeholder="Search by: Project / Subject / Faculty";

const suggestions = document.getElementById("suggestions");
const searchTerms = ["Unisphere"]; 

searchBar.addEventListener("input", function () {
    const input = searchBar.value.toLowerCase();
    suggestions.innerHTML = "";
    if (input.length > 0) {
        const matches = searchTerms.filter(term => term.toLowerCase().includes(input));
        if (matches.length > 0) {
            suggestions.style.display = "block";
            matches.forEach(match => {
                const div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = match;
                div.onclick = () => {
                    searchBar.value = match;
                    window.location.href="/student/groupDetails.html";
                    suggestions.style.display = "none";
                };
                suggestions.appendChild(div);
            });
        } else {
            suggestions.style.display = "none";
        }
    } else {
        suggestions.style.display = "none";
    }
});

document.addEventListener("click", (e) => {
    if (!searchBar.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.style.display = "none";
    }
});

let profile_userName = document.querySelector("#Profile_userName");
profile_userName.textContent="Harsh Soni";

let profile_userDetail = document.querySelector("#Profile_userDetail");
profile_userDetail.textContent="2nd year, B.tech(CSE VI)";

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



document.querySelector("#dashboard").addEventListener("click",function(){
    window.location.href="/student/dashboard.html";
});


let unispherePage = document.querySelector("#unispherePage");
unispherePage.addEventListener('click',function(){
     window.location.href="/student/groupDetails.html";
});