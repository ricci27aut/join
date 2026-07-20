let checkbox = false;

/**
 * Handles the sign up process
 * 
 * Clears all error messages
 * Check name, email and passowrd. Creates a user when there is no error
 * Displays a success action and move the user forwards
 * If there is an error. The error handler is called
 */
async function signup() {
    try {
        clearErrors();
        let userName = checkName();
        let userMail = checkMail();
        let userPassword = checkPassword();
        await createUser(userName, userMail, userPassword);
        succeedRegistration();
        const Timeout = setTimeout(fowarding, 2000);
    } catch (error) {
        error.code === 'password mismatch' ? passwordError(error) : error.code === 'noName' ? nameError(error) : emailError(error);
    };
};

/**
 * Displays a succeed message and add overflow: hidden to body
 * 
 */
function succeedRegistration() {
    let succeed = document.getElementById('succedSignup');
    succeed.classList.remove('d_none');
    document.getElementById('body').style.overflow = "hidden";
};

/**
 * moves the user forward to the login page
 * 
 */
function fowarding() {
    window.location.href = "../index.html";
};

/**
 * Posts the created user data to the API
 * 
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 */
async function createUser(name, email, password) {
    let response = await fetch(BASE_URL + "/users" + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                email: email,
                name: name,
                password: password
            })
    }); createContact(name, email);
};

/**
 * Posts the new user contact data to the API
 * 
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 */
async function createContact(name, email) {
     let response = await fetch(BASE_URL + "/contacts" + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                mail: email,
                name: name,
               phone_number: ""
            })
    });
}

/**
 * clears and removes all error messages and red border highlights
 * 
 */
function clearErrors() {
    clearNameAndMailErrors();
    clearPasswordErrors();
};

/**
 * clears and removes all error messages and red border highlights from name and mail input
 */
function clearNameAndMailErrors() {
    let nameInput = document.getElementById('warning-name');
    let nameContainer = document.getElementById('name-input-container');
    nameInput.classList.add('d_none');
    nameContainer.classList.remove('red-border');
    let warningMail = document.getElementById('warning-mail');
    let mailContainer = document.getElementById('mail-input-container');
    warningMail.classList.add('d_none');
    mailContainer.classList.remove('red-border');
}

/**
 * clears and removes all error messages and red border highlights from password input 
 */
function clearPasswordErrors() {
    let matchPassword = document.getElementById('warning-password');
    let passwordContainer = document.getElementById('pasword-confirm-input-container');
    let passwordConfirmContainer = document.getElementById('pasword-input-container');
    matchPassword.classList.add('d_none');
    passwordContainer.classList.remove('red-border');
    passwordConfirmContainer.classList.remove('red-border');
}

/**
 * Check the name value input
 * 
 * Throw error object if the input is empty
 * 
 * @returns {string} - the name value if correct
 */
function checkName() {
    let name = document.getElementById('name');
    let nameContainer = document.getElementById('name-input-container');
    let nameInput = document.getElementById('warning-name');
    if (name.value.trim().length === 0) {
        throw {
            code: 'noName',
            nameText: nameInput,
            nameBorder: nameContainer,
        };
    } else {
        return name.value
    };
};

/**
 * Check the password value input
 * 
 * Throw error object if the input is empty or doesn't match
 * 
 * @returns {string} - the password value if correct
 */
function checkPassword() {
    let password = document.getElementById('password');
    let confirmPwassword = document.getElementById('confirm-password');
    let matchPassword = document.getElementById('warning-password');
    let passwordContainer = document.getElementById('pasword-confirm-input-container');
    let passwordCOnfirmContainer = document.getElementById('pasword-input-container');
    if (password.value === confirmPwassword.value && password.value.length != 0) {
        return password.value
    } else {    throw {
                    code: 'password mismatch',
                    passwordText: matchPassword,
                    passwordBorder: passwordContainer,
                    passwordConfirmBorder: passwordCOnfirmContainer
    };};};

/**
 * Check the email value input
 * 
 * Throw error object if the input is empty or doesn't includes @ and .
 * 
 * @returns {string} - the email value if correct
 */
function checkMail() {
    let email = document.getElementById('mail');
    let warningMail = document.getElementById('warning-mail');
    let mailContainer = document.getElementById('mail-input-container');
    if (!email.value.includes('@') || !email.value.includes('.') || email.value.trim().length === 0) {
        throw {
            code: 'email incorrect',
            mailText: warningMail,
            mailBorder: mailContainer
        };
    } else {
        return email.value;
    };
};

/**
 * Updates the password visibility icon.
 * 
 * Shows different icons depending on the password length and input type
 */
function updatePasswordState(inputId, iconId) {
    let passwordRef = document.getElementById(inputId);
    let passwordIcon = document.getElementById(iconId);
    if (passwordRef.value.length > 0) {
        if (passwordRef.type === "password") {
            passwordIcon.src = `../assets/icons/pw-unvisible.png`
        } else {
            passwordIcon.src = `../assets/icons/pw-visible.png`
        };
    } else {
        passwordIcon.src = `../assets/icons/pw-lock.png`
    };
};

/**
 * Toggles the password visibility input value.
 * 
 * Show or hide the password value input and shows the associated icon
 */
function togglePasswordVisibility(inputId, iconId) {
    let passwordRef = document.getElementById(inputId);
    let passwordIcon = document.getElementById(iconId);
    if (passwordRef.type === "password" && passwordRef.value.length > 0) {
        passwordRef.type = "text"
        passwordIcon.src = `../assets/icons/pw-visible.png`
    } else if (passwordRef.type === "text" && passwordRef.value.length > 0) {
        passwordRef.type = "password"
        passwordIcon.src = `../assets/icons/pw-unvisible.png`
    };
};

/**
 * Handles the display of incorrect password.
 * 
 * Shows a warning message and highlights the relevant input fields with a red border.
 * 
 * @param {Object} error - The error object returned from {@link checkPassword}.
 */
function passwordError(error) {
    error.passwordText.classList.remove('d_none');
    error.passwordBorder.classList.add('red-border');
    error.passwordConfirmBorder.classList.add('red-border');
};

/**
 * Handles the display of incorrect name.
 * 
 * Shows a warning message and highlights the relevant input fields with a red border.
 * 
 * @param {Object} error - The error object returned from {@link checkName}.
 */
function nameError(error) {
    error.nameText.classList.remove('d_none');
    error.nameBorder.classList.add('red-border');
};

/**
 * Handles the display of incorrect email.
 * 
 * Shows a warning message and highlights the relevant input fields with a red border.
 * 
 * @param {Object} error - The error object returned from {@link checkMail}.
 */
function emailError(error) {
    error.mailText.classList.remove('d_none');
    error.mailBorder.classList.add('red-border');
};

/**
 * Toggles the checkbox in HTML and enables or disables the sign up button
 * 
 * This function updates the checkbox icon based on the global `checkbox` state
 * and enables or disables the signup button
 */
function toggleCheckbox() {
    let checkboxRef = document.getElementById('checkbox');
    let signupBtn = document.getElementById('signup-Btn');
    if (checkbox == false) {
        checkboxRef.src = `../assets/icons/checkbox-checked.png`
        signupBtn.disabled = false;
    } else {
        checkboxRef.src = `../assets/icons/checkbox.png`;
        signupBtn.disabled = true;
    }
    checkbox = !checkbox;
};