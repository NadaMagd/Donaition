let imageCase=document.getElementById("image");
let titleCase=document.getElementById("title");
let descriptionCase=document.getElementById("description");
let categoryCase=document.getElementById("Category");
let amountCase=document.getElementById("amount");
let dateCase=document.getElementById("date");
let createCaseButton=document.getElementById("sendData");
 class Case {
    #isApproved=true;
    constructor(title, description, category, goal, deadline, image) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.goal = goal;
        this.deadline = deadline;
        this.image =`assets/images/${image.files[0].name}`;
        this.#isApproved = true;
    }
    validate() {
        console.log(this.title, this.description, this.category, this.goal, this.deadline, this.image);
        return this.title && this.description && this.category && this.goal && this.deadline && this.image;
    }
    createCase() {
        if (this.validate()) {
            let caseData = {
                title: this.title,
                description: this.description,
                category: this.category,
                goal: this.goal,
                deadline: this.deadline,
                image: this.image,
                isApproved: false
            };
            try{
                const response = fetch("http://localhost:4000/cases", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(caseData)
                });
                if(!response.ok){
                    console.log("Error")
                }else{
                    console.log("success")
                }
            }catch (error) {
                console.error("Error:", error);
            }

        } else {
            console.log("Please fill in all fields");
        }
    }
 }
createCaseButton.addEventListener("click", function (e){
    e.preventDefault();
    let newCase = new Case(
        titleCase.value,
        descriptionCase.value,
        categoryCase.value,
        amountCase.value,
        dateCase.value,
        imageCase
    );
    newCase.createCase();
});