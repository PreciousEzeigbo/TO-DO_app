const lowercaseDisplay = document.getElementById("lowercase-alphabets");
const timer = document.getElementById("time");

// Function to shuffle lowercase letters
function shuffleLowercase() {
    const boxes = Array.from(lowercaseDisplay.getElementsByClassName("box"));

    // Shuffle the boxes array
    for (let a = boxes.length - 1; a > 0; a--) {
        const b = Math.floor(Math.random() * (a + 1));
        [boxes[a], boxes[b]] = [boxes[b], boxes[a]];
    }

    // Append shuffled boxes back to the container
    boxes.forEach(box => lowercaseDisplay.appendChild(box));
}

// Timer function
function startTimer(duration) {
    let timeLeft = duration;
    const timerInterval = setInterval(function () {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Display the timer on the page
        time.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            // Time is up, stop the timer
            clearInterval(timerInterval);

            // Disable all further interactions (prevent any clicks)
            disableInteractions();

            // Display message or take any other action when time is up
            alert("Time is up! You didn't finish the game.");
        } else {
            timeLeft--;
        }
    }, 1000); // Update the timer every second
}

// DOM content must be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Call the 2 minutes timer set for the puzzle
    startTimer(120);

    shuffleLowercase();

    let clickedUppercase = null;

    // Click event listeners for uppercase alphabets
    const uppercaseBoxes = document.querySelectorAll("#uppercase-alphabets .box");
    uppercaseBoxes.forEach(uppercaseBox => {
        uppercaseBox.addEventListener("click", function () {
            // Prevent clicking another uppercase alphabet before pairing alphabets
            if (clickedUppercase !== null) {
                return;
            }

            // Clicked uppercase letter will display a yellow color
            uppercaseBox.style.backgroundColor = "yellow";
            clickedUppercase = uppercaseBox;
        });
    });

    // Click event listeners for lowercase letters
    const lowercaseBoxes = document.querySelectorAll("#lowercase-alphabets .box");
    lowercaseBoxes.forEach(lowercaseBox => {
        lowercaseBox.addEventListener("click", function () {
            // Prevent clicking lowercase alphabet if no uppercase alphabet is clicked
            if (clickedUppercase === null) {
                return;
            }

            // Get the alphabets in both uppercase and lowercase
            const uppercaseAlphabets = clickedUppercase.textContent;
            const lowercaseAlphabets = lowercaseBox.textContent;

            // Check if the lowercase alphabet matches the clicked uppercase alphabet
            if (uppercaseAlphabets.toLowerCase() === lowercaseAlphabets) {
                // If pairing is correect, display both in green color
                lowercaseBox.style.backgroundColor = "green";
                clickedUppercase.style.backgroundColor = "green";

                // Correct pairing boxes displayed in green cannot be clicked again
                clickedUppercase.style.pointerEvents = "none";
                lowercaseBox.style.pointerEvents = "none";

                // Reset clickedUppercase for the next pairing
                clickedUppercase = null;
            } else {
                // If pairing is incorreect, display lowercase box in red color
                lowercaseBox.style.backgroundColor = "red";

                // Reset the highlight after 4 second to let the user see the result
                setTimeout(function () {
                    lowercaseBox.style.backgroundColor = "";
                    clickedUppercase.style.backgroundColor = "";
                    clickedUppercase = null;
                }, 4000);
            }
        });
    });
});

// Function to disable all alphabet interactions
function disableInteractions() {
    const allBoxes = document.querySelectorAll(".box");
    allBoxes.forEach(box => {
        // Disable further clicks
        box.style.pointerEvents = "none";
    });
}