let initialScore = 501;
let numbersEntered = [];
let scoreHistory = [initialScore]; // Track score history, starting with the initial score
let totalPoints = 0; // Track total points entered
let totalEntries = 0; // Track total number of entries
let average = 0; // Track average score

// Automatically focus the input field when the page loads
window.onload = function() {
    document.getElementById('numberInput').focus();
};

// Keep the input field focused when clicking outside
document.addEventListener('click', function (event) {
    const numberInput = document.getElementById('numberInput');

    // Check if the clicked element is not the input field itself
    if (event.target !== numberInput) {
        numberInput.focus(); // Refocus the input field
    }
});


document.addEventListener('DOMContentLoaded', function () {
    // Initialise modals
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

    // Add event listener for keyboard input on the number input field
    numberInputField.addEventListener('input', handleKeyboardInput);
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

// Function to handle number entry via buttons
function enterNumber(number) {
    numbersEntered.push(number);
    displayConcatenatedNumbers();
    document.getElementById('numberInput').focus(); // Refocus the input field
}

// Function to delete the last entered number
function deleteLastNumber() {
    if (numbersEntered.length > 0) {
        numbersEntered.pop();
        displayConcatenatedNumbers();
        document.getElementById('numberInput').focus(); // Refocus the input field
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

// Function to handle keyboard input and keep focus
function handleKeyboardInput(event) {
    const value = event.target.value;

    // Validate that the input contains only numbers (0-9)
    if (/^\d*$/.test(value)) {
        numbersEntered = value.split(''); // Update the numbersEntered array
    } else {
        // If invalid input, reset the input field to the valid content
        event.target.value = numbersEntered.join('');
    }

    // Refocus the input field after any input
    document.getElementById('numberInput').focus();
}

// Listen for the 'Enter' key on the input field
document.getElementById('numberInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        updateScore(); // Call the updateScore function when Enter is pressed
    }
});

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