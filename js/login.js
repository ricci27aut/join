let currentUser;

/**
 * Initializes the application when the page loads.
 * 
 * It closes the loading animation and fetches the users from the API.
 * 
 */
async function init() {
    const timeout = setTimeout(closeLoader, 2500);
    await fetchUsers();
};

/**
 * Handles the user login process.
 * 
 * This function is triggered when the login button is clicked.
 * It retrieves the email and password from the input fields,
 * checks if a matching user exists, and either redirects to the
 * summary page and saves the session, or displays an error if
 * credentials are invalid. Input fields are cleared afterwards. 
 * 
 */
function logIn() {
    let emailRef = document.getElementById('mail');
    let passwordRef = document.getElementById('password');
    currentUser = users.find((user) => user.email == emailRef.value && user.password == passwordRef.value);
    if (currentUser) {
        window.location.href = "./html/summary.html";
        safeToLocalStorage();
    } else {
        wrongMailandPassword(emailRef, passwordRef);
    };
    emailRef.value = "";
    passwordRef.value = "";
};

/**
 * Handles the guest login process.
 * 
 * This function is triggered when the guest button is clicked.
 * It sets the email and password fields to predefined guest credentials
 * and initiates the standard login process.
 * 
 */
function guestLogIn() {
    let emailRef = document.getElementById('mail');
    let passwordRef = document.getElementById('password');
    emailRef.value = "guest@login.com"
    passwordRef.value = "aH%1234567"
    logIn();
};

/**
 * Saves the currently logged in user's name to the local storage.
 * 
 */
function safeToLocalStorage() {
    localStorage.setItem("user", JSON.stringify(currentUser.name));
};

/**
 * Handles what happens if the logged-in fails
 * 
 * Displays a warning text and highlights the input fields with a red border
 * Clears the email and password input value
 * 
 * @param {HTMLInputElement} emailRef - This is the email input value 
 * @param {HTMLInputElement} passwordRef - This is the password input value 
 */
function wrongMailandPassword(emailRef, passwordRef) {
    let warningRef = document.getElementById('warning');
    let inputMail = document.getElementById('mail-container');
    let inputPassword = document.getElementById('password-container');
    warningRef.classList.remove('d_none');
    emailRef.value = "";
    passwordRef.value = "";
    inputMail.classList.add('red-border');
    inputPassword.classList.add('red-border');
};

/**
 * Removes the warning text and remove the red border
 * 
 */
function removeRedBorder() {
    let warningRef = document.getElementById('warning');
    let inputMail = document.getElementById('mail-container');
    let inputPassword = document.getElementById('password-container');
    warningRef.classList.add('d_none');
    inputMail.classList.remove('red-border');
    inputPassword.classList.remove('red-border');
};

/**
 * This function closes the start animation by adding a classlist
 * 
 */
function closeLoader() {
    document.getElementById('animation').classList.add('d_none');
};

/**
 * Updates the password visibility icon.
 * 
 * Shows different icons depending on the password length and input type
 * 
 */
function updatePasswordState() {
    let passwordRef = document.getElementById('password');
    let passwordIcon = document.getElementById('password-icon');
    if (passwordRef.value.length > 0) {
        if (passwordRef.type === "password") {
            passwordIcon.src = `./assets/icons/pw-unvisible.png`
        } else {
            passwordIcon.src = `./assets/icons/pw-visible.png`
        };
    } else {
        passwordIcon.src = `./assets/icons/pw-lock.png`
    };
};

/**
 * Toggles the password visibility input value.
 * 
 * Show or hide the password value input and shows the associated icon
 * 
 */
function togglePasswordVisibility() {
    let passwordRef = document.getElementById('password');
    let passwordIcon = document.getElementById('password-icon');
    if (passwordRef.type === "password" && passwordRef.value.length > 0) {
        passwordRef.type = "text"
        passwordIcon.src = `./assets/icons/pw-visible.png`
    } else if (passwordRef.type === "text" && passwordRef.value.length > 0) {
        passwordRef.type = "password"
        passwordIcon.src = `./assets/icons/pw-unvisible.png`
    };
};
