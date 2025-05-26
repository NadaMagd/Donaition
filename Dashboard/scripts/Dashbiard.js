window.addEventListener("load", function() {
  let btn = document.getElementById("toggle");
  let items = document.getElementById("aside");
  btn.addEventListener("click", function () {
    items.classList.toggle("show");
    console.log(items.classList);
  });

  // Initialize all charts after DOM is loaded
  fetchCasesAndDrawChart();
  fetchCategoryDonationsChart();
  fetchUsersAndDrawGenderChart();
});

async function fetchCasesAndDrawChart() {
  try {
    const response = await fetch("http://localhost:4000/cases");
    const cases = await response.json();

    const categoryTotals = {};

    cases.forEach(c => {
      const category = c.category || "Others";
   categoryTotals[category] = (categoryTotals[category] || 0) + Number(c.goal || 0);

    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const ctx = document.getElementById("donationChart").getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          label: "Total Donations",
          data: data,
          backgroundColor: [
            "#1E90FF", "#808080", "#36454F", "#87CEEB", "#9966FF", "#FF9F40"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
}
async function fetchUsersAndDrawGenderChart() {
  try {
    const response = await fetch("http://localhost:4000/users");
    const users = await response.json();

    const genderCount = { male: 0, female: 0 };

    users.forEach(user => {
      const gender = user.gender?.toLowerCase();
      if (gender === "male" || gender === "female") {
        genderCount[gender]++;
      }
    });

    const labels = ["Male", "Female"];
    const data = [genderCount.male, genderCount.female];

    const ctx = document.getElementById("userGenderChart").getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Number of Users by Gender",
          data: data,
          fill: false,
          borderColor: "#808080",
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
async function fetchCategoryDonationsChart() {
  try {
    const response = await fetch("http://localhost:4000/cases");
    const cases = await response.json();

    const categoryTotals = {};

    cases.forEach(c => {
      const category = c.category || "Others";
      const donated = Array.isArray(c.rewards) && c.rewards.length > 0
        ? Number(c.rewards[0].amount || 0)
        : 0;

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += donated;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const ctx = document.getElementById("donationByCategoryChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Total Donations by Category",
          data: data,
          backgroundColor: "#000080",
          borderColor: "#2b8bd4",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Donations per Category"
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (error) {
    console.error("Error fetching donation data:", error);
  }
}