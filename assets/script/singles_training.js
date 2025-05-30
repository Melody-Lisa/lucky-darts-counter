// Initialize dart values for 1-20, including bullseye values (25, 50)
let dartValues = Array.from({ length: 20 }, (_, i) => i + 1).concat(25, 50);

// Initialize game state variables
let currentIndex = 0;         // Current dart value index
let currentClicks = 0;        // Number of clicks for the current dart value
let initialScore = 0;         // Current score
let highestScore = 0;         // Highest score achieved
let scoreHistory = [initialScore]; // Store score history for undo functionality
let randomValues = [];        // Holds shuffled dart values for random order mode
let isRandomMode = false;     // Track if random mode is active

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
    } else if (value === 25) {
        buttonContainer.appendChild(createButton('Outer Bull', 5));  // 25 is 5 points
        buttonContainer.appendChild(createButton('Miss', 0));        // Miss button
    } else {
        buttonContainer.appendChild(createButton('Bull', 10));       // 50 is 10 points
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
            displayDartButtons(isRandomMode ? randomValues[currentIndex] : dartValues[currentIndex]); // Display previous set of buttons
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
        currentIndex++;              // Move to the next dart value

        if (isRandomMode) {
            if (currentIndex < randomValues.length) {
                displayDartButtons(randomValues[currentIndex]); // Show next set of buttons in random order
            } else {
                endGame();
            }
        } else {
            if (currentIndex < dartValues.length) {
                displayDartButtons(dartValues[currentIndex]); // Show next set of buttons incrementally
            } else {
                endGame();
            }
        }
    }
}

// Game modes: Incremental and Random

// Incremental mode displays dart values in sequential order
function incremental() {
    isRandomMode = false;
    currentIndex = 0;  // Reset index
    document.getElementById('incrementalButton').classList.add('active-mode');
    document.getElementById('randomButton').classList.remove('active-mode');
    displayDartButtons(dartValues[currentIndex]);
}

// Random mode displays dart values in a shuffled order
function randomOrder() {
    isRandomMode = true;
    currentIndex = 0;  // Reset index
    randomValues = shuffleArray([...dartValues]); // Shuffle values
    document.getElementById('randomButton').classList.add('active-mode');
    document.getElementById('incrementalButton').classList.remove('active-mode');
    displayDartButtons(randomValues[currentIndex]);
}

// End game: show checkout modal and restart game
function endGame() {
    // Update highest score before showing the modal
    if (initialScore > highestScore) {
        highestScore = initialScore;
    }
    
    // Update modal content
    document.getElementById("finalScoreText").textContent = `Final Score: ${initialScore}`;
    document.getElementById("highestScoreText").textContent = `Highest Score: ${highestScore}`;
    
    // Show modal
    const modal = M.Modal.getInstance(document.getElementById("checkoutModal"));
    modal.open();

    // Automatically restart game when modal is triggered
    restartGame();
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
document.addEventListener('DOMContentLoaded', function () {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals, {
        onCloseEnd: restartGame  // Ensure game restarts when modal closes
    });
    incremental();
});