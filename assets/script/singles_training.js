// Initialize dart values for 1-20, including bullseye values (25, 50)
let dartValues = [];
for (let i = 1; i <= 20; i++) {
    dartValues.push(i);
}
dartValues.push(25, 50); // Bullseye values

// Initialize game state variables
let currentIndex = 0;         // Current dart value index
let currentClicks = 0;        // Number of clicks for the current dart value
let initialScore = 0;         // Current score
let highestScore = 0;         // Highest score achieved
let scoreHistory = [initialScore]; // Store score history for undo functionality
let randomValues = [];        // Holds shuffled dart values for random order mode

// Game control functions

// Display dart buttons for a given value (S, D, T, Miss for 1-20; bullseye values 25, 50)
function displayDartButtons(value) {
    const buttonContainer = document.getElementById('dartButtons');
    buttonContainer.innerHTML = ''; // Clear previous buttons

    if (value <= 20) {
        buttonContainer.appendChild(createButton(`S${value}`, 1));   // Single button
        buttonContainer.appendChild(createButton(`D${value}`, 2));   // Double button
        buttonContainer.appendChild(createButton(`T${value}`, 3));   // Treble button
        buttonContainer.appendChild(createButton('Miss', 0));        // Miss button
    } else {
        buttonContainer.appendChild(createButton('25', 5));          // 25 is 5 points
        buttonContainer.appendChild(createButton('50', 10));         // 50 is 10 points
        buttonContainer.appendChild(createButton('Miss', 0));        // Miss button
    }
}

// Helper to create a button element with specified label and point value
function createButton(label, points) {
    const button = document.createElement('button');
    button.classList.add('waves-effect', 'waves-light', 'num-pad-btn', 'grey', 'darken-4');
    button.innerText = label;
    button.onclick = () => {
        enterScore(points);  // Update the score
        trackClicks();       // Track clicks and update buttons after 3 clicks
    };
    return button;
}

// Function to handle entered score and update display
function enterScore(points) {
    initialScore += points;             // Add points to score
    scoreHistory.push(initialScore);     // Save current score to history
    updateScoreDisplay();                // Update score display on page
}

// Undo functionality: removes the last score entered and adjusts button display if needed
function deleteLastScore() {
    if (scoreHistory.length > 1) {      // Ensure there's a score to revert to
        scoreHistory.pop();             // Remove latest score
        initialScore = scoreHistory[scoreHistory.length - 1]; // Revert to last score
        updateScoreDisplay();

        if (currentClicks === 0 && currentIndex > 0) {  // If last action changed dart value set
            currentIndex--;         // Move back to previous dart value
            currentClicks = 2;      // Set clicks to 2 to reflect 3-click cycle
            displayDartButtons(dartValues[currentIndex]); // Display previous set of buttons
        } else if (currentClicks > 0) {
            currentClicks--;        // Revert one click if staying on same set
        }
    } else {
        initialScore = 0;            // Reset to 0 if it's the last score
        updateScoreDisplay();
    }
}

// Update score display on page
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('initialScore');
    scoreDisplay.innerText = initialScore; // Display updated score
}

// Track button clicks and advance to the next dart value every 3 clicks
function trackClicks() {
    currentClicks++; // Increment click count

    if (currentClicks === 3) {
        currentClicks = 0;           // Reset clicks after 3
        currentIndex++;               // Move to the next dart value

        if (currentIndex < dartValues.length) {
            displayDartButtons(dartValues[currentIndex]); // Show next set of buttons
        } else {
            alert(`Thank you for playing!\nFinal Score: ${initialScore}`);
            currentIndex = 0;         // Reset index if all values are displayed
        }
    }
}

// Game modes: Incremental and Random

// Incremental mode displays dart values in sequential order
function incremental() {
    document.getElementById('incrementalButton').classList.add('active-mode');
    document.getElementById('randomButton').classList.remove('active-mode');

    if (currentIndex < dartValues.length) {
        displayDartButtons(dartValues[currentIndex]);
    } else {
        endGame();
    }
}

// Random mode displays dart values in a shuffled order
function randomOrder() {
    document.getElementById('randomButton').classList.add('active-mode');
    document.getElementById('incrementalButton').classList.remove('active-mode');

    if (randomValues.length === 0) {
        randomValues = shuffleArray([...dartValues]); // Shuffle values
    }

    if (randomValues.length > 0) {
        const value = randomValues.pop();
        displayDartButtons(value);
    } else {
        endGame();
    }
}

// End game: alerts final and highest scores, restarts game
function endGame() {
    alert(`Thank you for playing!\nFinal Score: ${initialScore}\nHighest Score: ${highestScore}`);
    if (initialScore > highestScore) {
        highestScore = initialScore;  // Update highest score if beaten
    }
    restartGame();                     // Restart game for a new round
}

// Reset all game states to initial values for a new game
function restartGame() {
    currentIndex = 0;
    currentClicks = 0;
    initialScore = 0;
    scoreHistory = [initialScore];
    randomValues = [];                 // Clear random values for new game
    updateScoreDisplay();
    incremental();                     // Default mode is incremental
}

// Utility functions

// Fisher-Yates shuffle algorithm to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initial setup: display the first set of buttons in incremental mode
incremental();