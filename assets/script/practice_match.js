let initialScore = 501;
let numbersEntered = [];
let scoreHistory = [initialScore]; // Track score history, starting with the initial score


function startGame() {
    initialScore = 501;
    numbersEntered = [];
    scoreHistory = [initialScore];
    displayConcatenatedNumbers();
    updateScoreDisplay();
}

// Function to display concatenated numbers in the input field
function displayConcatenatedNumbers() {
    const concatenatedNumbers = numbersEntered.join('');
    document.getElementById('numberInput').value = concatenatedNumbers;
}

// Function to update the score display
function updateScoreDisplay() {
    document.getElementById('initialScore').innerText = initialScore;
}

// Function to handle number entry
function enterNumber(number) {
    numbersEntered.push(number);
    displayConcatenatedNumbers();
}

// Function to delete the last entered number
function deleteLastNumber() {
    if (numbersEntered.length > 0) {
        numbersEntered.pop();
        displayConcatenatedNumbers();
    }

    // If there are no numbers left after deletion, restore the previous score
    if (numbersEntered.length === 0 && scoreHistory.length > 1) {
        scoreHistory.pop();          // Remove the latest score
        initialScore = scoreHistory[scoreHistory.length - 1]; // Revert to the previous score
        updateScoreDisplay();        // Update the score display
    }
}


// Function to update the score
function updateScore() {
    const concatenatedNumber = parseInt(numbersEntered.join(''));
    
    if (isNaN(concatenatedNumber)) {
        alert('Please enter a valid number');
        return;
    }

    if (concatenatedNumber > 180) {
        // If the entered number exceeds 180, show an error and don't update the score
        alert('Invalid input: A single score entry cannot exceed 180!');
        return;
    }

    const newScore = initialScore - concatenatedNumber;

    if (newScore < 0) {
        alert('Invalid input: Score cannot go below 0');
    } else {
        scoreHistory.push(newScore);  // Save the current score before updating
        initialScore = newScore;      // Update the score
        numbersEntered = [];          // Clear numbers after calculation
        displayConcatenatedNumbers();
        updateScoreDisplay();
    }

    if (newScore == 0) {
        updateScoreDisplay();
        alert('You checked out!');
    }
}

// Initial display of the score
startGame();