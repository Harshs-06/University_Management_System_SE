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




// Create popup container
const popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.top = "0";
popup.style.left = "0";
popup.style.width = "100%";
popup.style.height = "100%";
popup.style.background = "rgba(0, 0, 0, 0.5)";
popup.style.display = "none";
popup.style.justifyContent = "center";
popup.style.alignItems = "center";
popup.style.zIndex = "1000";

// Create popup content
const popupBox = document.createElement("div");
popupBox.style.background = "white";
popupBox.style.padding = "20px";
popupBox.style.borderRadius = "10px";
popupBox.style.textAlign = "center";
popupBox.style.width = "400px";
popupBox.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";

// Add heading
const title = document.createElement("h2");
title.innerText = "Share your work";

// Add description input
const textarea = document.createElement("textarea");
textarea.placeholder = "Description";
textarea.style.borderTop="2px solid #d4a358";
textarea.style.resize="none";

textarea.maxLength="100";
textarea.style.width = "100%";
textarea.style.marginBottom = "10px";

// Add upload area
// Create upload area
const uploadArea = document.createElement("div");
uploadArea.style.border = "2px dashed #d4a358";
uploadArea.style.borderRadius="10px"
uploadArea.style.padding = "40px";
uploadArea.style.marginBottom = "10px";
uploadArea.style.display = "flex";
uploadArea.style.justifyContent = "center";
uploadArea.style.alignItems = "center";
uploadArea.style.cursor = "pointer";

// Create and add an image inside upload area
const uploadImage = document.createElement("img");
uploadImage.src = "/assets/images/upload.png"; // Replace with your image path
uploadImage.alt = "Upload Icon";
uploadImage.style.width = "50px"; // Adjust size as needed
uploadImage.style.height = "50px";
uploadImage.style.objectFit = "contain";

// Append image to upload area
uploadArea.appendChild(uploadImage);


const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.style.display = "none";

uploadArea.addEventListener("click", () => {
    fileInput.click();
  });
// Show selected file name
const fileName = document.createElement("p");
fileName.style.marginTop = "5px";

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadIcon.src = e.target.result; // Display uploaded image
      };
      reader.readAsDataURL(file);
    }
  });

  uploadArea.appendChild(fileInput);
// Add share button
const shareButton = document.createElement("button");
shareButton.innerText = "Share";
shareButton.style.borderRadius="10px";
shareButton.style.width="100%"
shareButton.style.background = "#d4a358";
shareButton.style.color = "white";
shareButton.style.padding = "10px 20px";
shareButton.style.border = "none";
shareButton.style.cursor = "pointer";

// Append elements to popup box
popupBox.appendChild(title);
popupBox.appendChild(textarea);
popupBox.appendChild(uploadArea);
popupBox.appendChild(fileName);
popupBox.appendChild(shareButton);
popup.appendChild(popupBox);
document.body.appendChild(popup);
const openButton =  document.querySelector("#openshare");

// Show popup on button click
openButton.addEventListener("click", () => {
    popup.style.display = "flex";
});

// Close popup on outside click
popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});


document.querySelector("#checkGroupWork").addEventListener('click',function() {
    window.location.href="/student/checkTeamMates.html";
})