let tbody = document.querySelector("tbody");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 10;

async function getAllCasesUnApproved(page = 1) {
    try {
        const responseCases = await fetch(`http://localhost:4000/cases?isApproved=false`);
        if (!responseCases.ok) throw new Error("Cannot find the requested");

        const allData = await responseCases.json();
        console.log(allData)
        const totalCount = allData.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const DataCases = allData.slice(startIndex, endIndex);

        tbody.innerHTML = "";

        for (let i = 0; i < DataCases.length; i++) {
            let tr = document.createElement("tr");

            let td_id = document.createElement("td");
            td_id.innerText = (page - 1) * itemsPerPage + i + 1;
            tr.appendChild(td_id);

            let td_img = document.createElement("td");
            let image = document.createElement("img");
            image.src = `/${DataCases[i]["image"]}`;
            image.classList.add("image");
            td_img.appendChild(image);
            tr.appendChild(td_img);
            let td_title = document.createElement("td");
            td_title.innerText = DataCases[i]["category"];
            tr.appendChild(td_title);
            let td_goal = document.createElement("td");
            td_goal.innerText = `${DataCases[i]["goal"]}$`;
            tr.appendChild(td_goal);
            let td_data = document.createElement("td");
            td_data.innerText = `${DataCases[i]["deadline"]}`;
            tr.appendChild(td_data);
            let td_description = document.createElement("td");
            td_description.innerText = `${DataCases[i]["description"]}`;
            tr.appendChild(td_description);
            let td_Action = document.createElement("td");
            let deleteRow = document.createElement("button");
            deleteRow.innerText = "Block";
            deleteRow.addEventListener("click", () => {
                const deleteUser = async () => {
                    const response = await fetch(`http://localhost:4000/cases/${DataCases[i]["id"]}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        alert("User blocked successfully");
                        getAllCasesUnApproved(page);
                    } else {
                        alert("Failed to block user");
                    }
                };
                deleteUser();

            });
            let EditRow = document.createElement("button");
            EditRow.innerText = "Approval";
            td_Action.appendChild(EditRow);
            -
            EditRow.addEventListener("click", async () => {
                const response = await fetch(`http://localhost:4000/cases/${DataCases[i]["id"]}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ isApproved: true })
                });
                if (response.ok) {
                    alert("User approved successfully");
                    getAllCasesUnApproved(page);
                } else {
                    alert("Failed to approve user");
                }
            });
            td_Action.appendChild(deleteRow);
            tr.appendChild(td_Action);
            tbody.appendChild(tr);
        }

        renderPagination(totalCount, page);
    } catch (error) {
        console.error("Failed to fetch cases", error);
    }
}

function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = '';

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'd-flex justify-content-center align-items-center gap-2';

   
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.className = 'btn btn-outline-primary';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => getAllCasesUnApproved(currentPage - 1);
    paginationContainer.appendChild(prevButton);
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    if (startPage > 1) {
        paginationContainer.appendChild(createPageButton(1));
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.innerHTML = '...';
            ellipsis.className = 'mx-2';
            paginationContainer.appendChild(ellipsis);
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageButton(i));
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.innerHTML = '...';
            ellipsis.className = 'mx-2';
            paginationContainer.appendChild(ellipsis);
        }
        paginationContainer.appendChild(createPageButton(totalPages));
    }
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.className = 'btn btn-outline-primary';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => getAllCasesUnApproved(currentPage + 1);
    paginationContainer.appendChild(nextButton);

    const pageInfo = document.createElement('div');
    pageInfo.className = 'text-muted ms-3';
    pageInfo.style.fontSize = '14px';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    pagination.appendChild(paginationContainer);
}

function createPageButton(pageNum) {
    const button = document.createElement('button');
    button.textContent = pageNum;
    button.className = `btn ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
    button.disabled = pageNum === currentPage;
    button.onclick = () => {
        currentPage = pageNum;
        getAllCasesUnApproved(pageNum);
    };
    return button;
}



getAllCasesUnApproved(1);