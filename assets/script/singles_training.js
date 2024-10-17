let dartValues = [];
for (let i = 1; i <= 20; i++) {
    dartValues.push(i);
}
dartValues.push(25, 50); // Add bullseye values (25, 50)

let currentIndex = 0;   // Track the current dart value index
let currentClicks = 0;  // Track the number of clicks for the current dart value
let initialScore = 0;   // Set initial score to 0
let highestScore = 0;   // Track the highest score

// Function to display dart buttons dynamically for a given value
function displayDartButtons(value) {
    const buttonContainer = document.getElementById('dartButtons');
    buttonContainer.innerHTML = ''; // Clear previous buttons

    // Display S, D, T, and Miss buttons for values 1-20
    if (value <= 20) {
        const singleButton = createButton(`S${value}`, 1); // Single button adds 1 point
        const doubleButton = createButton(`D${value}`, 2); // Double button adds 2 points
        const trebleButton = createButton(`T${value}`, 3); // Treble button adds 3 points
        const missButton = createButton('Miss', 0);        // Miss button adds 0 points

        buttonContainer.appendChild(singleButton);
        buttonContainer.appendChild(doubleButton);
        buttonContainer.appendChild(trebleButton);
        buttonContainer.appendChild(missButton);
    } else {
        // Special buttons for bullseye values (25, 50)
        const bull25Button = createButton('25', 5); // 25 is treated as 5 points
        const bull50Button = createButton('50', 10); // 50 is treated as 10 points
        const missButton = createButton('Miss', 0); // Miss button adds 0 points

        buttonContainer.appendChild(bull25Button);
        buttonContainer.appendChild(bull50Button);
        buttonContainer.appendChild(missButton);
    }
}

// Helper function to create a button element
function createButton(label, points) {
    const button = document.createElement('button');
    button.classList.add('waves-effect', 'waves-light', 'num-pad-btn', 'grey', 'darken-4');
    button.innerText = label;

    button.onclick = () => {
        enterScore(points);  // Update the score
        trackClicks();       // Track the number of clicks and update buttons after 3 clicks
    };

    return button;
}

// Function to restart the game and reset all states
function restartGame() {
    currentIndex = 0;
    currentClicks = 0;
    initialScore = 0;
    randomValues = []; // Reset random values for a new game round
    updateScoreDisplay();

    // Default to incremental mode on restart
    incremental();
}

// Incremental function to show dart values sequentially
function incremental() {
    // Apply active class to Incremental button, remove from Random
    document.getElementById('incrementalButton').classList.add('active-mode');
    document.getElementById('randomButton').classList.remove('active-mode');

    if (currentIndex < dartValues.length) {
        // If we have more dart values, display the next set of buttons
        displayDartButtons(dartValues[currentIndex]);
    } else {
        // All dart values have been displayed, game ends here
        alert(`Thank you for playing!\nFinal Score: ${initialScore}\nHighest Score: ${highestScore}`);

        // Reset the game state for a new round
        restartGame();
    }
}

// Function to handle the entered score and update the displayed score
function enterScore(points) {
    initialScore += points; // Update the score by adding points
    updateScoreDisplay();   // Call function to update the score display
}

// Function to update the score display on the page
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('initialScore');
    scoreDisplay.innerText = initialScore; // Display the updated score
}

// Function to track clicks and update buttons after 3 clicks
function trackClicks() {
    currentClicks++; // Increment click count

    if (currentClicks === 3) {
        currentClicks = 0; // Reset clicks after 3
        currentIndex++;     // Move to the next dart value

        // If we have more dart values, display the next set of buttons
        if (currentIndex < dartValues.length) {
            displayDartButtons(dartValues[currentIndex]);
        } else {
            alert(`Thank you for playing!\nFinal Score: ${initialScore}`);
            currentIndex = 0; // Reset index if all values are displayed
        }
    }
}

// Random function to show dart values in random order
let randomValues = [];

function randomOrder() {
    // Apply active class to Random button, remove from Incremental
    document.getElementById('randomButton').classList.add('active-mode');
    document.getElementById('incrementalButton').classList.remove('active-mode');

    if (randomValues.length === 0) {
        randomValues = shuffleArray([...dartValues]); // Shuffle values for random mode
    }

    if (randomValues.length > 0) {
        const value = randomValues.pop();
        displayDartButtons(value); // Display buttons for that random value
    } else {
        // Game ends and score check
        alert(`Thank you for playing!\nFinal Score: ${initialScore}\nHighest Score: ${highestScore}`);

        if (initialScore > highestScore) {
            highestScore = initialScore; // Update highest score
        }

        // Reset game state for a new round
        restartGame();  // Properly restart the game here
    }
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initial call to display the first set of buttons
incremental();