let ProfileIcon = document.getElementById("ProfileIcon");

ProfileIcon.addEventListener("click", function () {
    let user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "pages/Register.html";
    } else {
        window.location.href = "pages/profile.html";
    }
});
