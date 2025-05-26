let tbody = document.querySelector("tbody");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 10;

async function getAllCases(page = 1) {
    try {
        const responseCases = await fetch(`http://localhost:4000/cases?isApproved=true`);
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
            image.src = `/assets/images/${DataCases[i]["image"]}`;
            image.classList.add("image");
            td_img.appendChild(image);
            tr.appendChild(td_img);

            let td_title = document.createElement("td");
            td_title.innerText = DataCases[i]["category"];
            tr.appendChild(td_title);

            let td_goal = document.createElement("td");
            td_goal.innerText = `${DataCases[i]["goal"]}$`;
            tr.appendChild(td_goal);

            let td_collect = document.createElement("td");
            td_collect.innerText = `${DataCases[i]["rewards"]["0"]["amount"]}$`;
            tr.appendChild(td_collect);

            let td_data = document.createElement("td");
            td_data.innerText = `${DataCases[i]["deadline"]}`;
            tr.appendChild(td_data);
           
            let td_state = document.createElement("td");
            td_state.innerText = `${DataCases[i]["rewards"]["0"]["state"]}`;
            tr.appendChild(td_state);
            let td_Action = document.createElement("td");
            let editBtn = document.createElement("button");
            editBtn.innerText = "Update";
            editBtn.className = "btn btn-primary btn-sm m-1";
            editBtn.onclick = () => editCase(DataCases[i].id);
            td_Action.appendChild(editBtn);
            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.className =  "btn btn-info btn-sm m-1";
            deleteBtn.onclick = () => deleteCase(DataCases[i].id);
            td_Action.appendChild(deleteBtn);
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
    prevButton.onclick = () => getAllCases(currentPage - 1);
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
    nextButton.onclick = () => getAllCases(currentPage + 1);
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
        getAllCases(pageNum);
    };
    return button;
}

async function editCase(caseId) {
    try {
        const response = await fetch(`http://localhost:4000/cases/${caseId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch case. Status: ${response.status}`);
        }
        const caseData = await response.json();
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'editCaseModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Case</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCaseForm">
                            <div class="mb-3">
                                <label class="form-label">Category</label>
                                <input type="text" class="form-control" id="editCategory" value="${caseData.category}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Goal Amount ($)</label>
                                <input type="number" class="form-control" id="editGoal" value="${caseData.goal}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Collected Amount ($)</label>
                                <input type="number" class="form-control" id="editCollected" value="${caseData.rewards[0].amount}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Deadline</label>
                                <input type="date" class="form-control" id="editDeadline" value="${caseData.deadline}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">State</label>
                                <select class="form-control" id="editState">
                                    <option value="pending" ${caseData.rewards[0].state === 'Not complete' ? 'selected' : ''}>Not Complete</option>
                                    <option value="success" ${caseData.rewards[0].state === 'complete' ? 'selected' : ''}>Completed</option>
                                    <option value="failed" ${caseData.rewards[0].state === 'soon' ? 'selected' : ''}>Soon</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveCaseChanges(${caseId})">Save Changes</button>
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
        console.error("Failed to edit case:", error);
        alert("Failed to edit case. Please try again later.");
    }
}

async function saveCaseChanges(caseId) {
    try {
        const category = document.getElementById('editCategory').value;
        const goal = document.getElementById('editGoal').value;
        const collected = document.getElementById('editCollected').value;
        const deadline = document.getElementById('editDeadline').value;
        const state = document.getElementById('editState').value;

        const response = await fetch(`http://localhost:4000/cases/${caseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category,
                goal: parseFloat(goal),
                deadline,
                rewards: [{
                    amount: parseFloat(collected),
                    state: state
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update case. Status: ${response.status}`);
        }

        const modal = document.getElementById('editCaseModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        getAllCases(currentPage);
        alert('Case updated successfully!');
    } catch (error) {
        console.error("Failed to save case changes:", error);
        alert("Failed to save changes. Please try again later.");
    }
}

async function deleteCase(caseId) {
    if (!confirm('Are you sure you want to delete this case?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/cases/${caseId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete case. Status: ${response.status}`);
        }

        getAllCases(currentPage);
    } catch (error) {
        console.error("Failed to delete case:", error);
        alert("Failed to delete case. Please try again later.");
    }
}

getAllCases(1);