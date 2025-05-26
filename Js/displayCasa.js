let card = document.querySelector(".cards");
let categoryFilter = document.getElementById("categoryFilter");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 6;
async function getAllCasesApprove(page = 1, category = "all") {
    try {
        const responseCases = await fetch(`http://localhost:4000/cases?isApprove=true`);
        if (!responseCases.ok) throw new Error("Cannot find the requested");

        let allData = await responseCases.json();

        if (category !== "all") {
            allData = allData.filter(c => c.category === category);
        }

        const totalCount = allData.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const DataCases = allData.slice(startIndex, endIndex);

        card.innerHTML = "";
        for (let i = 0; i < DataCases.length; i++) {
            let cardElement = document.createElement("div");
            cardElement.classList.add("card");

            let cardImg = document.createElement("img");
            cardImg.src = `/assets/images/${DataCases[i]["image"]}`;
            cardImg.alt = "card image";
            cardElement.appendChild(cardImg);

            let cardTitle = document.createElement("h3");
            cardTitle.innerText = DataCases[i]["category"];
            cardElement.appendChild(cardTitle);

            let cardDescription = document.createElement("p");
            cardDescription.innerText = DataCases[i]["description"];
            cardElement.appendChild(cardDescription);

            let cardButton = document.createElement("button");
            cardButton.innerText = "Donate";

            cardButton.addEventListener("click", () => {
                localStorage.setItem("caseId", DataCases[i]["id"]);
                window.location.href = "Donation.html";
            });
            cardElement.appendChild(cardButton);

            let reward = DataCases[i].rewards?.[0];
            let percent = reward ? Math.round(reward.amount / DataCases[i].goal * 100) : 0;
            let cardRate = document.createElement("h5");
            cardRate.innerText = `${percent} % Donated${reward ? "" : " (New Case)"}`;
            cardElement.appendChild(cardRate);


            cardElement.classList.add("cardCategory");
            card.appendChild(cardElement);
        }

        renderPagination(totalCount, page, category);
    } catch (error) {
        console.error("Failed to fetch cases", error);
    }
}

function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.classList.add("DonationBtn");
        btn.textContent = i;
        if (i === currentPage) btn.disabled = true;

        btn.onclick = () => {
            getAllCasesApprove(i);
        };

        pagination.appendChild(btn);
    }
}


categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;
    getAllCasesApprove(1, selectedCategory);
});

getAllCasesApprove(1, "all");


