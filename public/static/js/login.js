// Login form handling
const form = document.getElementById('form');
const usernameOrEmail = document.getElementById('identifier');
const password = document.getElementById('password');


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
    // Retrieve the values from the login form inputs
    const identifierValue = usernameOrEmail.value.trim();
    const passwordValue = password.value.trim();

    let valid = true;

    if (identifierValue === '') {
        // Display error and add the error class
        setErrorFor(usernameOrEmail, 'Username or Email cannot be blank');
        valid = false;
    } else {
        // Display success class
        setSuccessFor(usernameOrEmail);
    }

    if (passwordValue === '') {
        // Display error and add the error class
        setErrorFor(password, 'Password cannot be blank');
        valid = false;
    } else {
        // Display success class
        setSuccessFor(password);
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
