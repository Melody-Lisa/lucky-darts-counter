let initialScore = 501;
let numbersEntered = [];
let scoreHistory = [initialScore]; // Track score history, starting with the initial score
let totalPoints = 0; // Track total points entered
let totalEntries = 0; // Track total number of entries
let average = 0; // Track average score

// Initialise modals
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

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

// Function to update the average display
function updateAverageDisplay() {
    document.getElementById('averageScore').innerText = average.toFixed(2);
    // Display the average with 2 decimal places
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

// Function to clear the input area
function clearInput() {
    numbersEntered.length = 0;
    displayConcatenatedNumbers();
}

// Function to update the score
function updateScore() {
    const concatenatedNumber = parseInt(numbersEntered.join(''));

    if (isNaN(concatenatedNumber)) {
        var modalInstance = M.Modal.getInstance(document.getElementById('nanModal'));
        modalInstance.open();
        return;
    }

    if (concatenatedNumber > 180) {
        var modalInstance = M.Modal.getInstance(document.getElementById('tooHighModal'));
        modalInstance.open();
        return;
    }

    const newScore = initialScore - concatenatedNumber;

    if (newScore < 0) {
        var modalInstance = M.Modal.getInstance(document.getElementById('minusModal'));
        modalInstance.open();
    } else {
        scoreHistory.push(newScore);  // Save the current score before updating
        initialScore = newScore;      // Update the score
        totalPoints += concatenatedNumber; // Add to total points
        totalEntries++; // Increment the total entries count
        average = totalPoints / totalEntries; // Calculate the average score
        numbersEntered = []; // Clear numbers after calculation
        displayConcatenatedNumbers();
        updateScoreDisplay();
        updateAverageDisplay(); // Update the average display after score update
    }

    if (newScore == 0) {
        updateScoreDisplay();
        var modalInstance = M.Modal.getInstance(document.getElementById('checkoutModal'));
        modalInstance.open();
    }
}

// Initial display of the score
startGame();