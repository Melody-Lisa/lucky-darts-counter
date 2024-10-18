let initialScore = 501;
let numbersEntered = [];
let scoreHistory = [initialScore]; // Track score history, starting with the initial score

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

// Function to clear the input area //
function clearInput() {
    numbersEntered.length = 0;
    displayConcatenatedNumbers();
}

// Function to update the score
function updateScore() {
    const concatenatedNumber = parseInt(numbersEntered.join(''));

    if (isNaN(concatenatedNumber)) {
        // Error handler if anything other a number is entered
        var modalInstance = M.Modal.getInstance(document.getElementById('nanModal'));
        modalInstance.open();
        return;
    }

    if (concatenatedNumber > 180) {
        // Error handler if the entered number exceeds 180
        var modalInstance = M.Modal.getInstance(document.getElementById('tooHighModal'));
        modalInstance.open();
        return;
    }

    const newScore = initialScore - concatenatedNumber;

    if (newScore < 0) {
        // Error handler if the entered number drops the score below 0
        var modalInstance = M.Modal.getInstance(document.getElementById('minusModal'));
        modalInstance.open();
    } else {
        scoreHistory.push(newScore);  // Save the current score before updating
        initialScore = newScore;      // Update the score
        numbersEntered = [];          // Clear numbers after calculation
        displayConcatenatedNumbers();
        updateScoreDisplay();
    }

    if (newScore == 0) {
        updateScoreDisplay();
        var modalInstance = M.Modal.getInstance(document.getElementById('checkoutModal'));
        modalInstance.open();
    }
}

// Initial display of the score
startGame();