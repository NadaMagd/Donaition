let profileName = document.getElementById("profileName");
let profileEmail = document.getElementById("profileEmail");
let profilePhone = document.getElementById("profilePhone");
let profilePassword = document.getElementById("profilePassword");
let profileGender = document.getElementById("profileGender");
let profileRole = document.getElementById("profileRole");
function getProfile() {
    try{
        if (localStorage.getItem("userId")) {
            profileName.innerText = localStorage.getItem("userName");
            profileEmail.innerText = localStorage.getItem("userEmail");
            profilePhone.innerText = localStorage.getItem("userPhone");
            profilePassword.innerText = localStorage.getItem("userPassword");
            profileGender.innerText = localStorage.getItem("userGender");
            profileRole.innerText = localStorage.getItem("userRole");
        }else{
            alert("User not logged in");
            window.location.href = "/pages/login.html";
        }
    }catch(error){
        console.error(error);
    }
}
getProfile();