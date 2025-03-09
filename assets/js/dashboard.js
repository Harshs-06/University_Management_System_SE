
let searchBar=document.querySelector("#searchBar");
searchBar.placeholder="Search"



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


// let todo_items = document.querySelector("#todo_items");
// let items = [["study","Preparation for ML mid sem","start at 20:00"]];
// let item_category_icon= {"study":"/assets/images/item_study.png","warn":"/assets/images/item_warning.png"};
// function your_todo_items() {
//     for (let i = 0; i < items.length; i++) {
//         let div = document.createElement('div');
//         div.className="items_div"
        
        
//         let icon = document.createElement('img');
//         icon.src = item_category_icon[items[i][0]];
//         icon.className="item_cat_icon";
//         icon.style.width = "24px";
        
      
        
//         let title = document.createElement('p');
//         title.textContent = items[i][1];
//         title.className="item_title"
       
        
//         let time = document.createElement('p');
//         time.className="item_time"
//         time.textContent = items[i][2];
       
       
        
        
       
//         div.appendChild(icon);
//         div.appendChild(title);
//         div.appendChild(time);
        
//         todo_items.appendChild(div);
//     }
// }

// your_todo_items()
    
document.querySelectorAll('.sub_option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.sub_option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});






