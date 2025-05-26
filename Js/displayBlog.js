let card = document.querySelector(".Blogs");
let pagination = document.querySelector(".pagination");
let currentPage = 1;
const itemsPerPage = 3;
async function getAllCasesApprove(page = 1) {
    try {
        const responseCases = await fetch(`http://localhost:4000/blogs`);
        if (!responseCases.ok) throw new Error("Cannot find the requested");
        let allData = await responseCases.json();

        const totalCount = allData.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const blogData = allData.slice(startIndex, endIndex);

        card.innerHTML = "";
        const row = document.createElement("div");
       
        for (let i = 0; i < blogData.length; i++) {
            const col = document.createElement("div");
            col.className = "col";
      
            let cardElement = document.createElement("div");
            cardElement.className = "blog-card";
            
            let cardImg = document.createElement("img");
            cardImg.src = `/assets/images/${blogData[i]["image"]}`;
            cardImg.alt = "blog image";
            cardImg.className = "img-fluid mb-2";
            cardElement.appendChild(cardImg);

            let cardTitle = document.createElement("h3");
            cardTitle.innerText = blogData[i]["title"];
            cardElement.appendChild(cardTitle);

            let content = blogData[i]["content"];
            let shortText = content.substring(0, 100); 
            let isExpanded = false;

            let cardDescription = document.createElement("p");
            cardDescription.className = "blog-content";
            cardDescription.innerText = shortText + "...";

            let toggleButton = document.createElement("button");
            toggleButton.className = "read-more-btn";
            toggleButton.innerText = "Read more";
            toggleButton.addEventListener("click", () => {
                if (isExpanded) {
                    cardDescription.innerText = shortText + "...";
                    toggleButton.innerText = "Read more";
                } else {
                    cardDescription.innerText = content;
                    toggleButton.innerText = "Read less";
                }
                isExpanded = !isExpanded;
            });

            cardElement.appendChild(cardDescription);
            cardElement.appendChild(toggleButton);
            col.appendChild(cardElement);
            row.appendChild(col);
        }
        card.appendChild(row);

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

getAllCasesApprove(1, "all");
