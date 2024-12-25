// Puzzle 1: Uppercase and Lowercase Matching
const lowercaseDisplay = document.getElementById("lowercase-alphabets");
const timer = document.getElementById("time");
let timerInterval;
let puzzle1Complete = false;
let clickedUppercase = null;

// Function to shuffle lowercase letters for puzzle 1
function shuffleLowercase() {
    const boxes = Array.from(lowercaseDisplay.getElementsByClassName("box"));
    for (let a = boxes.length - 1; a > 0; a--) {
        const b = Math.floor(Math.random() * (a + 1));
        [boxes[a], boxes[b]] = [boxes[b], boxes[a]];
    }
    boxes.forEach(box => lowercaseDisplay.appendChild(box));
}

// Timer function
function startTimer(duration) {
    let timeLeft = duration;
    timerInterval = setInterval(function () {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            disableInteractions();
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
        box.style.pointerEvents = "none";
    });
}

// Function to switch to Puzzle 2 after Puzzle 1 is completed
function switchToPuzzle2() {
    document.getElementById("puzzle-1").style.display = "none";
    document.getElementById("lowercase-alphabets").style.display = "none";
    document.getElementById("uppercase-alphabets").style.display = "none";
    document.getElementById("time").style.display = "none";
    document.getElementById("puzzle-2").style.display = "flex";
    document.getElementById("alphabets-order").style.display = "flex";
    document.getElementById("alphabets-displayed").style.display = "flex";
    document.getElementById("time").style.display = "flex";
    document.getElementById("time").style.justifyContent = "center";
}

// Puzzle 1: Uppercase and Lowercase Matching Logic
function setupPuzzle1() {
    const uppercaseBoxes = document.querySelectorAll("#uppercase-alphabets .box");
    const lowercaseBoxes = document.querySelectorAll("#lowercase-alphabets .box");

    uppercaseBoxes.forEach(uppercaseBox => {
        uppercaseBox.addEventListener("click", function () {
            if (clickedUppercase !== null) return;

            uppercaseBox.style.backgroundColor = "yellow";
            clickedUppercase = uppercaseBox;
        });
    });

    lowercaseBoxes.forEach(lowercaseBox => {
        lowercaseBox.addEventListener("click", function () {
            if (clickedUppercase === null) return;

            const uppercaseAlphabets = clickedUppercase.textContent;
            const lowercaseAlphabets = lowercaseBox.textContent;

            if (uppercaseAlphabets.toLowerCase() === lowercaseAlphabets) {
                lowercaseBox.style.backgroundColor = "green";
                clickedUppercase.style.backgroundColor = "green";
                clickedUppercase.style.pointerEvents = "none";
                lowercaseBox.style.pointerEvents = "none";
                clickedUppercase = null;

                // Check if all pairs are correct
                if ([...uppercaseBoxes].every(box => box.style.backgroundColor === "green") &&
                    [...lowercaseBoxes].every(box => box.style.backgroundColor === "green")) {
                    puzzle1Complete = true;
                    setTimeout(() => switchToPuzzle2(), 500);
                }
            } else {
                lowercaseBox.style.backgroundColor = "red";
                setTimeout(function () {
                    lowercaseBox.style.backgroundColor = "";
                    clickedUppercase.style.backgroundColor = "";
                    clickedUppercase = null;
                }, 2000);
            }
        });
    });
}

// Puzzle 2: Alphabetical Ordering
function setupPuzzle2() {
    const alphabetsDisplayed = document.getElementById("alphabets-displayed");
    const alphabetsOrder = document.getElementById("alphabets-order");
    const displayedBoxes = Array.from(alphabetsDisplayed.getElementsByClassName("box"));
    const orderBoxes = Array.from(alphabetsOrder.getElementsByClassName("box"));

    const alphabetDisplayed = displayedBoxes.map(box => box.textContent.toLowerCase());
    const correctOrder = [...alphabetDisplayed].sort();

    let currentIndex = 0;

    displayedBoxes.forEach(renderedAlphabets => {
        renderedAlphabets.addEventListener("click", function () {
            if (renderedAlphabets.style.pointerEvents === "none") return;

            const letter = renderedAlphabets.textContent.toLowerCase();

            if (letter === correctOrder[currentIndex]) {
                const correspondingOrderBox = document.getElementById("box-" + (currentIndex + 1));
                correspondingOrderBox.textContent = renderedAlphabets.textContent;
                renderedAlphabets.style.pointerEvents = "none";
                correspondingOrderBox.style.backgroundColor = "lightgreen";
                renderedAlphabets.style.backgroundColor = "lightgreen";
                currentIndex++;
            } else {
                const correspondingOrderBox = document.getElementById("box-" + (currentIndex + 1));
                correspondingOrderBox.textContent = "❌";
                correspondingOrderBox.style.backgroundColor = "red";
                renderedAlphabets.style.backgroundColor = "red";

                displayedBoxes.forEach(box => box.style.pointerEvents = "none");

                setTimeout(() => {
                    correspondingOrderBox.textContent = "";
                    correspondingOrderBox.style.backgroundColor = "";
                    renderedAlphabets.style.backgroundColor = "";

                    renderedAlphabets.style.pointerEvents = "auto";
                    displayedBoxes.forEach(box => box.style.pointerEvents = "auto");
                }, 2000);
            }

            if ([...orderBoxes].every(box => box.textContent !== "")) {
                alert("Puzzle 2 is complete!");
                disableInteractions();
            }
        });
    });
}

// DOM content loaded event
document.addEventListener("DOMContentLoaded", function () {
    startTimer(600);
    shuffleLowercase();
    setupPuzzle1();
    setupPuzzle2();
});
