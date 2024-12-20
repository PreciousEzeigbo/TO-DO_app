// Registration form handling
const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');


// Check if the registration form exists on the page
if (form) {
    // Add an event listener for the form's submit event
    form.addEventListener('submit', async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Validate form inputs
        if (checkInputs()) {
            // Submit form if inputs are valid
            form.submit();
        }
    });
}

function checkInputs() {
    // Retrieve the values from the registration form inputs
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    let valid = true;

    if (usernameValue === '') {
        // Display error and add the error class
        setErrorFor(username, 'Username cannot be blank');
        valid = false;
    } else {
        // Display success class
        setSuccessFor(username);
    }

    if (emailValue === '') {
        // Display error and add the error class
        setErrorFor(email, "Email cannot be blank");
        valid = false;
    } else if (!validEmail(emailValue)) {
        setErrorFor(email, 'Email is not valid');
        valid = false;
    } else {
        setSuccessFor(email);
    }

    if (passwordValue === '') {
        // Display error and add the error class
        setErrorFor(password, 'Password cannot be blank');
        valid = false;
    } else if (!validPassword(passwordValue)) {
        setErrorFor(password, "Must be Alphanumric with special character!");
        valid = false;
    } else {
        // Display success class
        setSuccessFor(password);
    }

    if (confirmPasswordValue === '') {
        // Display error and add the error class
        setErrorFor(confirmPassword, 'Password confirmation cannot be blank');
        valid = false;
    } else if (passwordValue !== confirmPasswordValue) {
        setErrorFor(confirmPassword, 'Passwords do not match');
        valid = false;
    } else {
        // Display success class
        setSuccessFor(confirmPassword);
    }

    // If form is valid, return valid
    return valid;
}

    // .form-control
function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small')

    // Add the error class
    formControl.className = 'form-control error';

    // Add error message inside small
    small.innerText = message;
}

    // .form-control
function setSuccessFor(input) {
    const formControl = input.parentElement;

    // Add the success class
    formControl.className = 'form-control success';
}

// Check if email is valid
function validEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Checks password strength
function validPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%])[A-Za-z\d@$!%]{8,}$/;
    return passwordPattern.test(password); 
}