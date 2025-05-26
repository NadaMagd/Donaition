const tbody = document.querySelector("tbody");
const pagination = document.getElementById("pagination");
const itemsPerPage = 10;
let currentPage = 1;

async function getAllDonators(page = 1) {
    try {
        const response = await fetch("http://localhost:4000/users");
        if (!response.ok) {
            throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }
        const users = await response.json();
        // Filter out users without donationInfo
        const validUsers = users.filter(user => user && user.donationInfo && user.donationInfo.length > 0);
        const totalCount = validUsers.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = validUsers.slice(startIndex, endIndex);

        displayDonators(paginatedUsers);
        displayPagination(totalCount, page);

    } catch (error) {
        handleError(error);
    }
}
function displayDonators(users) {
    tbody.innerHTML = '';

    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No donators found</td></tr>';
        return;
    }

    users.forEach((user, index) => {
        const tr = createDonatorRow(user, index);
        tbody.appendChild(tr);
    });
}
function createDonatorRow(user, index) {
    const tr = document.createElement("tr");
    const donationInfo = user.donationInfo && user.donationInfo.length > 0 ? user.donationInfo[0] : {
        totalamount: 0,
        numOfDontion: 0,
        data: 'N/A'
    };
    
    const rowData = [
        { text: (currentPage - 1) * itemsPerPage + index + 1 }, 
        { text: user.name || 'N/A' },
        { text: user.email || 'N/A' },
        { text: `$${donationInfo.totalamount || 0}` },
        { text: donationInfo.numOfDontion || 0 },
        { text: donationInfo.data || 'N/A' }
    ];
    rowData.forEach(data => {
        const td = document.createElement("td");
        td.innerText = data.text;
        tr.appendChild(td);
    });
    const actionCell = createActionButtons(user.id);
    tr.appendChild(actionCell);

    return tr;
}
//action buttons
function createActionButtons(userId) {
    const td = document.createElement("td");
    
    const editBtn = document.createElement("button");
    editBtn.innerText = "Update";
    editBtn.className = "btn btn-primary btn-sm m-1";
    editBtn.onclick = () => editDonator(userId);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "btn btn-info btn-sm m-1";
    deleteBtn.onclick = () => deleteDonator(userId);
    
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);

    return td;
}
function displayPagination(totalItems, currentPage) {
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "d-flex justify-content-center align-items-center gap-2 mt-4 mb-3";

    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&laquo;";
    prevButton.className = "btn btn-outline-primary";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => getAllDonators(currentPage - 1);
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
    nextButton.onclick = () => getAllDonators(currentPage + 1);
    paginationContainer.appendChild(nextButton);
    const pageInfo = document.createElement("div");
    pageInfo.className = "text-muted ms-3 d-flex align-items-center";
    pageInfo.style.fontSize = "14px";
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);
    const wrapper = document.createElement("div");
    wrapper.className = "pagination-wrapper w-100 d-flex justify-content-center";
    wrapper.appendChild(paginationContainer);
    wrapper.style.width = "100%";
    pagination.appendChild(wrapper);
}
   // hii git hub
function createPageButton(pageNum) {
    const button = document.createElement("button");
    button.textContent = pageNum;
    button.className = `btn ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
    button.disabled = pageNum === currentPage;
    button.onclick = () => {
        currentPage = pageNum;
        getAllDonators(pageNum);
    };
    return button;
}
function handleError(error) {
    console.error("Error:", error.message);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error: ${error.message}</td></tr>`;
    if (pagination) {
        pagination.innerHTML = "";
    }
}
async function viewDonator(id) {
    try {
        console.log("Viewing donator:", id);
    } catch (error) {
        handleError(error);
    }
}
async function toggleDonatorStatus(id, currentStatus) {
    try {
        const response = await fetch(`http://localhost:4000/users/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isActive: !currentStatus
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update status. Status: ${response.status}`);
        }

        getAllDonators(currentPage);
    } catch (error) {
        handleError(error);
    }
}
  //update button
async function editDonator(id) {
    try {
        const response = await fetch(`http://localhost:4000/users/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user. Status: ${response.status}`);
        }
        const user = await response.json();
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'editDonatorModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Donator</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editDonatorForm">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" id="editName" value="${user.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Total Amount</label>
                                <input type="number" class="form-control" id="editAmount" value="${user.donationInfo[0].totalamount}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Number of Donations</label>
                                <input type="number" class="form-control" id="editNumDonations" value="${user.donationInfo[0].numOfDontion}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Last Donation Date</label>
                                <input type="date" class="form-control" id="editDate" value="${user.donationInfo[0].data}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveDonatorChanges(${id})">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        // Clean up modal when hidden
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    } catch (error) {
        handleError(error);
    }
}

async function saveDonatorChanges(id) {
    try {
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const amount = document.getElementById('editAmount').value;
        const numDonations = document.getElementById('editNumDonations').value;
        const date = document.getElementById('editDate').value;

        const response = await fetch(`http://localhost:4000/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                donationInfo: [{
                    totalamount: parseFloat(amount),
                    numOfDontion: parseInt(numDonations),
                    data: date
                }] })
        });

        if (!response.ok) {
            throw new Error(`Failed to update user. Status: ${response.status}`);
        }
        const modal = document.getElementById('editDonatorModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        getAllDonators(currentPage);
        alert('Donator updated successfully!');
    } catch (error) {
        handleError(error);
    }
}
async function deleteDonator(id) {
    if (!confirm('Are you sure you want to delete this donator?')) {
        return;
    }
try {
        const response = await fetch(`http://localhost:4000/users/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user. Status: ${response.status}`);
        }
        getAllDonators(currentPage);
    } catch (error) {
        handleError(error);
    }
}
getAllDonators(1);
