let imageCase=document.getElementById("image");
let titleCase=document.getElementById("title");
let descriptionCase=document.getElementById("description");
let categoryCase=document.getElementById("category");
let amountCase=document.getElementById("goal");
let dateCase=document.getElementById("deadline");
let createCaseButton=document.getElementById("submitCase");
let displayImage=document.getElementById("displayImage");
let locationCase=document.getElementById("location");
let userId=localStorage.getItem("userId");
 class Case {
    #isApproved=false;
    constructor(title, description, category, goal, location, deadline, image) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.goal = goal;
        this.deadline = deadline;
        this.image =`/assets/images/${image.files[0].name}`;
        this.location = location;
        this.#isApproved = false;
    }
    validate() {

    return this.title && this.description && this.category && this.goal && this.location && this.deadline && this.image;
}
    createCase() {
        if (this.validate()) {
            let caseData = {
                title: this.title,
                description: this.description,
                category: this.category,
                goal: this.goal,
                location: this.location,
                deadline: this.deadline,
                image: this.image,
                isApproved: false,
                userId: localStorage.getItem("userId")
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
                    console.log(caseData)
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
        locationCase.value,
        dateCase.value,
        imageCase
    );
    newCase.createCase();
});