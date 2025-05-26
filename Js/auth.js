function validateInput(inputElement, validationFunction) {
    inputElement.addEventListener("blur", (e) => {
        if (validationFunction(e.target.value)) {
            inputElement.style.border = "1px solid green";
        } else {
            inputElement.style.border = "1px solid red";
            inputElement.select();
        }
    });
}
let inputUserName = document.getElementById("UsernameLogin");
let inputPasswordLogin = document.getElementById("passwordLogin");
validateInput(inputUserName, IsUserName);
validateInput(inputPasswordLogin, IsPassword);
let btnLogin = document.getElementById("LoginBtn");
btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();
   try{
    const responseLogin=await fetch("http://localhost:4000/users");
    const dataUser=await responseLogin.json();
    console.log(dataUser);
    const UserFind=dataUser.find(user=>inputUserName.value==user.name&&inputPasswordLogin.value==user.password)
    if(UserFind){
        if(UserFind["isActive"]==false){
        alert("blocked user");
        return;
        }else{
        alert("Login successful");
        localStorage.setItem("user", JSON.stringify(UserFind));
        localStorage.setItem("userId", UserFind.id);
        localStorage.setItem("userName", UserFind["name"]);
        localStorage.setItem("userEmail", UserFind["email"]);
        localStorage.setItem("userPhone", UserFind["phoneNumber"]);
        localStorage.setItem("userGender", UserFind["gender"]);
        localStorage.setItem("userRole", UserFind["role"]);
        localStorage.setItem("userPassword", UserFind["password"]);
        window.location.href = "/pages/profile.html";
    }
    }else{
        alert("Invalid username or password");
    }

   }catch(error){
         console.error("Error during login:", error);
    }
});
