let inputFirstName=document.getElementById("firstName");
let inputLastName=document.getElementById("lastName");
let inputEmail=document.getElementById("email");
let inputDate=document.getElementById("Date");
let inputGender=document.getElementById("Gender");
let inputCompany=document.getElementById("Company");
let inputCategory=document.getElementById("category");
let inputDescription=document.getElementById("Description");
let inputImage=document.getElementById("Image");
let displayImage=document.getElementById("displayImage");
let btnSubmit=document.getElementById("SendDate");
let btnReset=document.getElementById("ResetData");

btnSubmit.addEventListener("click", function() {
    let formData = {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        email: inputEmail.value,
        date: inputDate.value,
        gender: inputGender.value,
        company: inputCompany.value,
        category: inputCategory.value,
        description: inputDescription.value,
        image: inputImage.files[0]
    };
    console.log(formData);
});


