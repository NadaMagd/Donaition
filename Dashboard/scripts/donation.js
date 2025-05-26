let tbody = document.querySelector("tbody");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 10;

async function getAllDonations(page = 1) {
    try {
        cuurentPage = page;
        const response = await fetch(`http://localhost:4000/pledges`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        const totalCount = data.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const DataDonation = data.slice(startIndex, endIndex);

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

            let td_payment = document.createElement("td");
            td_payment.innerText = DataDonation[i]["cardNumber"];
            tr.appendChild(td_payment);
            let td_Action = document.createElement("td");
            let editBtn = document.createElement("button");
            editBtn.innerText = "Update";
            editBtn.className = "btn btn-primary btn-sm m-1";
            editBtn.onclick = () => editDonation(DataDonation[i].id, DataDonation[i].userId); 
            td_Action.appendChild(editBtn);

            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.className = "btn btn-info btn-sm m-1";
            deleteBtn.onclick = () => deleteDonation(DataDonation[i].id, DataDonation[i].userId); 
            td_Action.appendChild(deleteBtn);

            tr.appendChild(td_Action);
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

async function approveDonation(userId) {
    try {
        const response = await fetch(`http://localhost:4000/pledges/${userId}`, {
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
async function editDonation(id) {
    try {
        console.log("Fetching pledge with id:", id);
        const pledgeResponse = await fetch(`http://localhost:4000/pledges/${id}`);
        if (!pledgeResponse.ok) throw new Error('Failed to fetch pledge');

        const pledge = await pledgeResponse.json();

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'editDonationModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Donation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editDonationForm">
                            <div class="mb-3">
                                <label class="form-label">Donor Name</label>
                                <input type="text" class="form-control" id="editName" value="${pledge.Name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="editEmail" value="${pledge.email}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Amount</label>
                                <input type="number" class="form-control" id="editAmount" value="${pledge.amount}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-control" id="editStatus">
                                    <option value="pending" ${pledge.state === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="success" ${pledge.state === 'success' ? 'selected' : ''}>Success</option>
                                    <option value="failed" ${pledge.state === 'failed' ? 'selected' : ''}>Failed</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveDonationChanges('${id}')">Save Changes</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

    } catch (error) {
        console.error("Failed to edit donation:", error);
        alert("Failed to edit donation. Please try again later.");
    }
}

async function saveDonationChanges(id) {
    try {
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const amount = document.getElementById('editAmount').value;
        const status = document.getElementById('editStatus').value;

        const response = await fetch(`http://localhost:4000/pledges/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: name,
                email: email,
                amount: parseFloat(amount),
                state: status
            })
        });

        if (!response.ok) throw new Error('Failed to update pledge');

        const modal = document.getElementById('editDonationModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        getAllDonations(currentPage); 
        alert('Donation updated successfully!');
    } catch (error) {
        console.error("Failed to save donation changes:", error);
        alert("Failed to save changes. Please try again later.");
    }
}

async function deleteDonation(id, userId) {
    if (!confirm('Are you sure you want to delete this donation?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/pledges/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete pledge. Status: ${response.status}`);
        }

        getAllDonations(currentPage);
    } catch (error) {
        console.error("Failed to delete donation:", error);
        alert("Failed to delete donation. Please try again later.");
    }
}

getAllDonations(1);