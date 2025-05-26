import { uploadFile } from "./uploadImage.js";
uploadFile();
let inputImage=document.getElementById("image");
let target_div=document.getElementById("Part_image");
let imageDisplay=document.getElementById("ImageCasas");
let inputTitle=document.getElementById("title");
let inputCategory=document.getElementById("Category");
let inputAmount=document.getElementById("amount");
let inputDate=document.getElementById("date");
let inputDescription=document.getElementById("description");
let buttonSend=document.getElementById("sendData");
let userId = localStorage.getItem("userId");
buttonSend.addEventListener("click",(e)=>{
    let options=inputCategory.options[inputCategory.selectedIndex].text;
   e.preventDefault();
    let caseDonation={
        title:inputTitle.value,
        category:options,
        image:imageDisplay.getAttribute("src"),
        description:inputDescription.value,
        amount:+inputAmount.value,
        date:inputDate.value,
        }
    console.log(caseDonation)
});
 try {
                const responseUser=await fetch("http://localhost:4000/cases",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(caseDonation)
                    }
                );
                if(!responseUser.ok){
                    console.log("Error")
                }else{
                    console.log("suscess")
                }
            }
            catch(error) {
                console.error(error)
            }
        