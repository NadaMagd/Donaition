let tbody = document.querySelector("tbody");
let pagination = document.getElementById("pagination");
let currentPage = 1;
const itemsPerPage = 10;
async function AllUserNotApprove(page = 1) {
    try {
        const responseCases = await fetch(`http://localhost:4000/users?isActive=false`);
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
            let deleteRow = document.createElement("button");
            deleteRow.innerText = "Block";
            deleteRow.className = "btn btn-info btn-sm m-1";
            deleteRow.addEventListener("click", () => {
               
                const deleteUser = async () => {
                    const response = await fetch(`http://localhost:4000/users/${DataUser[i]["id"]}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        alert("User blocked successfully");
                        AllUserNotApprove(page);
                    } else {
                        alert("Failed to block user");
                    }
                };
                deleteUser();

            });
            let EditRow = document.createElement("button");
            EditRow.innerText = "Approval";
            EditRow.className = "btn btn-primary btn-sm m-1";
            td_Action.appendChild(EditRow);
            EditRow.addEventListener("click", async () => {
                const response = await fetch(`http://localhost:4000/users/${DataUser[i]["id"]}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ isActive: true })
                });
                if (response.ok) {
                    alert("User approved successfully");
                    AllUserNotApprove(page);
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
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "btn btn-primary btn-sm m-1";
        if (i === currentPage) btn.disabled = true;

        btn.onclick = () => {
            AllUserNotApprove(i);
        };
        pagination.appendChild(btn);
    }
}


AllUserNotApprove(1);
