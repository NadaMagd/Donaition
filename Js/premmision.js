window.addEventListener("DOMContentLoaded", function () {
  let permission = document.getElementById("DashboardIcon");
  let cases = document.getElementById("CreateCasse");
  let donate = document.getElementById("DonateUser");
  function checkPermission() {
    let role = localStorage.getItem("userRole");
    if (!role) {
      permission.style.display = "none";
      cases.style.display = "none";
      donate.style.display = "none";
    } else if (role === "Admin") {
      permission.style.display = "block";
      permission.href = "Dashboard/pagesDashboard/home.html";
      cases.style.display = "block";
      donate.style.display = "block";
    } else if (role === "campaigner" || role === "both") {
      permission.href = "/DashboardCompainger/pagesCompainger/Cases.html";
      permission.style.display = "block";
      cases.style.display = "block";
      donate.style.display = "block";
    } else if (role === "Donor") {
      permission.style.display = "none";
      cases.style.display = "none";
      donate.style.display = "block";
    }
  }

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("user");

    window.location.href = "pages/login.html";
  });
  checkPermission();
});
