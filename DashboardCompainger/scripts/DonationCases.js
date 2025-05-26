let tbody = document.querySelector("tbody");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 10;
async function getAllDonations(page = 1) {
    try {
        currentPage = page;
        const userId = localStorage.getItem("userId");
        const casesResponse = await fetch(`http://localhost:4000/cases?userId=${userId}`);
        if (!casesResponse.ok) throw new Error("Failed to fetch cases");
        const userCases = await casesResponse.json();
        const userCaseIds = userCases.map(c => c.id);
        const pledgesResponse = await fetch(`http://localhost:4000/pledges`);
        if (!pledgesResponse.ok) throw new Error("Failed to fetch pledges");
        const pledges = await pledgesResponse.json();
        const userDonations = pledges.filter(p => userCaseIds.includes(p.caseId));
        const totalCount = userDonations.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const DataDonation = userDonations.slice(startIndex, endIndex);

        tbody.innerHTML = "";

        for (let i = 0; i < DataDonation.length; i++) {
            let tr = document.createElement("tr");

            let td_id = document.createElement("td");
            td_id.innerText = (page - 1) * itemsPerPage + i + 1;
            tr.appendChild(td_id);

            let td_name = document.createElement("td");
            td_name.innerText = DataDonation[i]["Name"];
            tr.appendChild(td_name);

            let td_email = document.createElement("td");
            td_email.innerText = DataDonation[i]["email"];
            tr.appendChild(td_email);

            let td_goal = document.createElement("td");
            td_goal.innerText = `${DataDonation[i]["amount"]}$`;
            tr.appendChild(td_goal);

            let td_status = document.createElement("td");
            td_status.innerText = DataDonation[i]["state"];
            tr.appendChild(td_status);

            let td_date = document.createElement("td");
            td_date.innerText = DataDonation[i]["date"];
            tr.appendChild(td_date);

            let td_payment = document.createElement("td");
            td_payment.innerText = DataDonation[i]["cardNumber"];
            tr.appendChild(td_payment);

            let td_Action = document.createElement("td");
            let editBtn = document.createElement("button");
            editBtn.innerText = "Update";
            editBtn.className = "btn btn-warning btn-sm m-1";
            editBtn.onclick = () => editCase(DataDonation[i].id);
            td_Action.appendChild(editBtn);

            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.className = "btn btn-danger btn-sm m-1";
            deleteBtn.onclick = () => deleteCase(DataDonation[i].id);
            td_Action.appendChild(deleteBtn);

            tr.appendChild(td_Action);
            tbody.appendChild(tr);
        }

        renderPagination(totalCount, page);
    } catch (error) {
        console.error("Failed to fetch donations:", error);
        alert("Failed to fetch donations. Please try again later.");
    }
}


function renderPagination(totalItems, currentPage) {
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";

 
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "d-flex justify-content-center align-items-center gap-2";
    paginationContainer.style.width = "100%";

 
    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&laquo;";
    prevButton.className = "btn btn-outline-primary";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => getAllDonations(currentPage - 1);
    paginationContainer.appendChild(prevButton);

 
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

  
    if (startPage > 1) {
        paginationContainer.appendChild(createPageButton(1));
        if (startPage > 2) {
            const ellipsis = document.createElement("span");
            ellipsis.innerHTML = "...";
            ellipsis.className = "mx-2";
            paginationContainer.appendChild(ellipsis);
        }
    }


    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageButton(i));
    }

  
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement("span");
            ellipsis.innerHTML = "...";
            ellipsis.className = "mx-2";
            paginationContainer.appendChild(ellipsis);
        }
        paginationContainer.appendChild(createPageButton(totalPages));
    }


    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&raquo;";
    nextButton.className = "btn btn-outline-primary";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => getAllDonations(currentPage + 1);
    paginationContainer.appendChild(nextButton);
    const pageInfo = document.createElement("div");
    pageInfo.className = "text-muted ms-3";
    pageInfo.style.fontSize = "14px";
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    pagination.appendChild(paginationContainer);
}

function createPageButton(pageNum) {
    const button = document.createElement("button");
    button.textContent = pageNum;
    button.className = `btn ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
    button.disabled = pageNum === currentPage;
    button.onclick = () => {
        currentPage = pageNum;
        getAllDonations(pageNum);
    };
    return button;
}

async function approveDonation(pledgeId, userId) {
    try {
        const response = await fetch(`http://localhost:4000/users/${userId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                donationInfo: [{
                    state: "success"
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        getAllDonations(currentPage);
    } catch (error) {
        console.error("Failed to approve donation:", error);
        alert("Failed to approve donation. Please try again later.");
    }
}
getAllDonations();