// Login form handling
const form = document.getElementById('form');
const usernameOrEmail = document.getElementById('identifier');
const password = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');


// Check if the login form exists on the page
if (form) {
    // Add an event listener for the form's submit event
    form.addEventListener('submit', async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Validate form inputs
        checkInputs();
    });

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

        // If form is valid, proceed with the login request
        if (valid) {
            submitForm(identifierValue, passwordValue);
        }
    }

    async function submitForm(identifier, password) {
        // Display loading gif
        document.getElementById("loading").style.display = "block";
        try {
            // Send a POST request to the login endpoint with the form data
            const response = await fetch("/api/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicate JSON content
                    'Accept': 'application/json' // Accept JSON responses
                },
                // Send form data as JSON
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            });

            // Hide loading gif
            document.getElementById("loading").style.display = "none";

            if (response.ok) {
                const data = await response.json();
                const token = data.accessToken;

                sessionStorage.setItem("token", token);


                // Dispaly success message
                document.getElementById("success-message").style.display = "block";
                // Redirect to the home page on successful login after 4 seconds
                setTimeout(() => {
                    window.location.href = '/home.html';
                }, 4000);
            } else {
                // Handle errors if login fails
                const data = await response.json();
                alert(data.errors[0]?.msg || 'Unknown error');
            }
        } catch (error) {
            // Hide loading gif
            document.getElementById("loading").style.display = "none";
            // Handle network or unexpected errors
            console.error('Error during login:', error);
            alert('An error occurred while logging in.');
        }
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
}

// Toggle password
togglePasswordBtn.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        togglePasswordBtn.classList.remove('fa-eye-slash');
        togglePasswordBtn.classList.add('fa-eye');
    } else {
        password = 'password';
        togglePasswordBtn.classList.remove('fa-eye');
        togglePasswordBtn.classList.add('fa-eye-slash');
    };
});