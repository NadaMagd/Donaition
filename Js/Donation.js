let amount25=document.getElementById("amount25");
let amount50=document.getElementById("amount50");
let amount100=document.getElementById("amount100");
let amount200=document.getElementById("amount200");
let customAmount=document.getElementById("customAmount");
let cardNumber=document.getElementById("cardNumber");
let cardExpire=document.getElementById("cardExpiry")
let cardCvv=document.getElementById("cardCVV");
let FirstName=document.getElementById("firstName");
let LastName=document.getElementById("lastName");
let EmailAddress=document.getElementById("emailAddress");
let donateBtn=document.getElementById("donateButton");
let userId=localStorage.getItem("userId");
let caseId=localStorage.getItem("caseId");
donateBtn.addEventListener("click", async(e)=>{
    let fullName = `${FirstName.value.trim()} ${LastName.value.trim()}`;

    let amount= amount25.checked ? amount25.value :
        amount50.checked ? amount50.value :
        amount100.checked ? amount100.value :
        amount200.checked ? amount200.value :
        customAmount.checked ? customAmount.value :
        0;
    e.preventDefault();
    let DonationUser={
        "userId": userId,
        "Name": fullName,
        "email": EmailAddress.value,
        "caseId": caseId,
        "amount": Number(amount),
        "cardNumber": cardNumber.value,
        "cardExpire":Number(cardExpire.value),
        "cardCvv": Number(cardCvv.value),
        "state": "success",
    }
    console.log(DonationUser);
    try {
        const responseDonation = await fetch("http://localhost:4000/pledges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(DonationUser)
        });
        if(responseDonation.ok){
                    console.log(DonationUser)
                }else{
                    console.log("success")
                }
    }catch (error) {
        console.error("Failed to fetch cases", error);
    }
});
