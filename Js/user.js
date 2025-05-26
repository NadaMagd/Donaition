let inputName = document.getElementById("Username");
let inputEmail = document.getElementById("Email");
let inputPassword = document.getElementById("password");
let inputGender = document.getElementById("gender");
let inputRole = document.getElementById("role");
let inputPhoneNum = document.getElementById("phoneNum");
class User {
    #isActive = false;
    constructor(name, role, email, gender, phone, password) {
        this.name = name;
        this.role = role;
        this.#isActive = false;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.phone = phone;
    }
    validateData() {
        return IsUserName(this.name) && IsPassword(this.password) && IsEmail(this.email) && IsPhoneValid(this.phone);
    }
   async register() {
    if (!this.validateData()) {
        console.log("not valid");
    } else {
        let data = {
            name: this.name,
            role: this.role,
            email: this.email,
            password: this.password,
            gender: this.gender,
            phoneNumber: this.phone,
            isActive: this.#isActive
        }
        console.log(data);
        try {
            const checkEmail = await fetch(`http://localhost:4000/users?email=${this.email}`);
            const existingUsers = await checkEmail.json();
            if (existingUsers.length > 0) {
                alert("Email already exists");
                window.location.href = "pages/Register.html";
                return;
            }

            const responseUser = await fetch("http://localhost:4000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!responseUser.ok) {
                console.log("Error");
            } else {
                console.log("success");
                window.location.href = "pages/login.html";
            }
        } catch (error) {
            console.error(error);
        }
    }
}

}
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
validateInput(inputPassword, IsPassword);
validateInput(inputEmail, IsEmail);
validateInput(inputName, IsUserName);
validateInput(inputPhoneNum, IsPhoneValid);
document.forms[0].addEventListener("submit", (e) => {
    e.preventDefault();
    const user = new User(inputName.value, inputRole.value, inputEmail.value, inputGender.value, inputPhoneNum.value, inputPassword.value);
    user.register();
    window.location.href = "pages/login.html";
});
