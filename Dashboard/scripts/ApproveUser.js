let tbody = document.querySelector("tbody");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 10;
async function getAllUsersAdorable(page = 1) {
    try {
        const responseCases = await fetch(`http://localhost:4000/users?isActive=true`);
        if (!responseCases.ok) throw new Error("Cannot find the requested");
        const allData = await responseCases.json();
        console.log(allData)
        const totalCount = allData.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const DataUser = allData.slice(startIndex, endIndex);

        tbody.innerHTML = "";

        for (let i = 0; i < DataUser.length; i++) {
            let tr = document.createElement("tr");
            tr.classList.add("table-row");
            
            let td_id = document.createElement("td");
            td_id.innerText = (page - 1) * itemsPerPage + i + 1;
            tr.appendChild(td_id);
            
            let td_name = document.createElement("td");
            td_name.innerText = DataUser[i]["name"];
            tr.appendChild(td_name);
            
            let td_email = document.createElement("td");
            td_email.innerText = DataUser[i]["email"];
            tr.appendChild(td_email);
            
            let td_role = document.createElement("td");
            td_role.innerText = `${DataUser[i]["role"]}`;
            tr.appendChild(td_role);
            
            let td_phone = document.createElement("td");
            td_phone.innerText = `${DataUser[i]["phoneNumber"]}`;
            tr.appendChild(td_phone);
            
            let td_gender = document.createElement("td");
            td_gender.innerText = `${DataUser[i]["gender"]}`;
            tr.appendChild(td_gender);
            
            let td_Active = document.createElement("td");
            td_Active.innerText = `${DataUser[i]["isActive"]}`;
            tr.appendChild(td_Active);
            
            let td_Action = document.createElement("td");
            
            let editBtn = document.createElement("button");
            editBtn.innerText = "Update";
            editBtn.className = "btn btn-primary btn-sm m-1";
            editBtn.onclick = () => editUser(DataUser[i].id);
            td_Action.appendChild(editBtn);
            
            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.className = "btn btn-info btn-sm m-1";
            deleteBtn.onclick = () => deleteUser(DataUser[i].id);
            td_Action.appendChild(deleteBtn);
            
            tr.appendChild(td_Action);
            tbody.appendChild(tr);
        }

        renderPagination(totalCount, page);
    } catch (error) {
        console.error("Failed to fetch users", error);
    }
}

function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "d-flex justify-content-center align-items-center gap-2 mt-4 mb-3";

    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&laquo;";
    prevButton.className = "btn btn-outline-primary";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => getAllUsersAdorable(currentPage - 1);
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
    nextButton.onclick = () => getAllUsersAdorable(currentPage + 1);
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
        getAllUsersAdorable(pageNum);
    };
    return button;
}

async function editUser(userId) {
    try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user. Status: ${response.status}`);
        }
        const userData = await response.json();
    
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'editUserModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" id="editName" value="${userData.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="editEmail" value="${userData.email}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" class="form-control" id="editPhone" value="${userData.phoneNumber}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Role</label>
                                <select class="form-control" id="editRole">
                                    <option value="user" ${userData.role === 'user' ? 'selected' : ''}>User</option>
                                    <option value="admin" ${userData.role === 'Admin' ? 'selected' : ''}>Admin</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Active</label>
                                <select class="form-control" id="editStatus">
                                    <option value="true" ${userData.isActive === true ? 'selected' : ''}>True</option>
                                    <option value="false" ${userData.isActive === false ? 'selected' : ''}>False</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveUserChanges(${userId})">Save Changes</button>
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
        console.error("Failed to edit user:", error);
        alert("Failed to edit user. Please try again later.");
    }
}

async function saveUserChanges(userId) {
    try {
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        const role = document.getElementById('editRole').value;
        const isActive = document.getElementById('editStatus').value === 'true';

        const response = await fetch(`http://localhost:4000/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phoneNumber: phone,
                role,
                isActive
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update user. Status: ${response.status}`);
        }

        const modal = document.getElementById('editUserModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        getAllUsersAdorable(currentPage);
        alert('User updated successfully!');
    } catch (error) {
        console.error("Failed to save user changes:", error);
        alert("Failed to save changes. Please try again later.");
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/users/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user. Status: ${response.status}`);
        }

        getAllUsersAdorable(currentPage);
        alert('User deleted successfully!');
    } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again later.");
    }
}

getAllUsersAdorable(1);
