const lowercaseDisplay = document.getElementById("lowercase-alphabets");
const timer = document.getElementById("time");
let timerInterval;
let puzzle1Complete = false;

// Function to shuffle lowercase letters for puzzle 1
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
    timerInterval = setInterval(function () {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Display the timer on the page
        timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

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
    }, 1000);
}


// Function to disable all alphabet interactions
function disableInteractions() {
    const allBoxes = document.querySelectorAll(".box");
    allBoxes.forEach(box => {
        // Disable further clicks
        box.style.pointerEvents = "none";
    });
}


// Switch between Puzzle 1 and Puzzle 2
function switchToPuzzle2() {
    // Hide Puzzle 1
    document.getElementById("puzzle-1").style.display = "none";
    document.getElementById("uppercase-alphabets").style.display = "none";
    document.getElementById("lowercase-alphabets").style.display = "none";

    // Show Puzzle 2
    document.getElementById("puzzle-2").style.display = "block";
    document.getElementById("alphabets-order").style.display = "block";

    // Start Puzzle 2 timer (same 10 minutes)
    startTimer(600);
}


// DOM content must be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Call the 2 minutes timer set for the puzzle
    startTimer(600);

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

                // Check if all pairs are correct and switch to Puzzle 2
                const allUppercaseBoxes = document.querySelectorAll("#uppercase-alphabets .box");
                const allLowercaseBoxes = document.querySelectorAll("#lowercase-alphabets .box");

                // If all uppercase and lowercase boxes are matched, move to Puzzle 2
                if ([...allUppercaseBoxes].every(box => box.style.backgroundColor === "green") &&
                    [...allLowercaseBoxes].every(box => box.style.backgroundColor === "green")) {
                    puzzle1Complete = true;
                    setTimeout(() => switchToPuzzle2(), 500);
                }
            } else {
                // If pairing is incorreect, display lowercase box in red color
                lowercaseBox.style.backgroundColor = "red";

                // Reset the highlight after 4 second to let the user see the result
                setTimeout(function () {
                    lowercaseBox.style.backgroundColor = "";
                    clickedUppercase.style.backgroundColor = "";
                    clickedUppercase = null;
                }, 2000);
            }
        });
    });
});

// Puzzle 2: Alphabetical Order (Arrange the alphabets displayed in alphabets order)
document.addEventListener("DOMContentLoaded", function () {
    const alphabetsDisplayed = document.getElementById("alphabets-displayed");
    const alphabetsOrder = document.getElementById("alphabets-order");

    // Get all lowercase alphabet boxes and uppercase boxes
    const displayedBoxes = Array.from(alphabetsDisplayed.getElementsByClassName("box"));
    const orderBoxes = Array.from(alphabetsOrder.getElementsByClassName("box"));

    // Click event to move lowercase letter into uppercase box
    displayedBoxes.forEach(lowercaseBox => {
        lowercaseBox.addEventListener("click", function () {
            const letter = displayBox.textContent.toUpperCase();  // Convert to uppercase
            const correspondingOrderBox = document.getElementById(letter);

            // Only move the letter if the corresponding uppercase box is empty
            if (!correspondingOrderBox.textContent) {
                correspondingOrderBox.textContent = lowercaseBox.textContent;
                lowercaseBox.style.pointerEvents = "none";  // Disable further clicking on this box

                // Change the background color to show the letter is placed correctly
                correspondingOrderBox.style.backgroundColor = "lightgreen";
                lowercaseBox.style.backgroundColor = "lightgreen";

                // Optionally, add some feedback here when a letter is placed correctly
            }

            // Check if Puzzle 2 is complete (if all uppercase boxes are filled)
            if ([...orderBoxes].every(box => box.textContent !== "")) {
                alert("Puzzle 2 is complete!");
                disableInteractions(); // Disable further clicks once Puzzle 2 is completed
            }
        });
    });
});