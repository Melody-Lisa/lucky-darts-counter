// Player-specific initial scores
let currentPlayer = 1;
let initialScore = { 1: 501, 2: 501 };  // Starting score for both players
let numbersEntered = [];
let scoreHistory = [{ ...initialScore }]; // Track score history per player
let totalPoints = { 1: 0, 2: 0 }; // Track total points per player

// Function to detect if the user is on a mobile device
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Automatically focus the input field when the page loads (desktop only)
window.onload = function () {
    if (!isMobileDevice()) {
        document.getElementById('numberInput').focus();
    }
};

// Keep the input field focused when clicking outside (desktop only)
document.addEventListener('click', function (event) {
    const numberInput = document.getElementById('numberInput');
    if (!isMobileDevice() && event.target !== numberInput) {
        numberInput.focus();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Initialize modals
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    // Add event listener for keyboard input only on desktop
    if (!isMobileDevice()) {
        document.getElementById('numberInput').addEventListener('input', handleKeyboardInput);
    }
});

function startGame() {
    initialScore = { 1: 501, 2: 501 };
    currentPlayer = 1; // Start with Player 1
    numbersEntered = [];
    scoreHistory = [{ ...initialScore }];
    totalPoints = { 1: 0, 2: 0 }; // Reset total points
    displayConcatenatedNumbers();
    updateScoreDisplay();
}

// Function to display concatenated numbers in the input field
function displayConcatenatedNumbers() {
    const concatenatedNumbers = numbersEntered.join('');
    document.getElementById('numberInput').value = concatenatedNumbers;
}

// Function to handle number entry via buttons
function enterNumber(number) {
    numbersEntered.push(number);
    displayConcatenatedNumbers();
    if (!isMobileDevice()) {
        document.getElementById('numberInput').focus();
    }
}

// Function to update the score display
function updateScoreDisplay() {
    document.getElementById('playerOneInitialScore').innerText = initialScore[1];
    document.getElementById('playerTwoInitialScore').innerText = initialScore[2];

    // Highlight the active player's score area
    document.getElementById('playerOneInitialScore').classList.toggle('active-player', currentPlayer === 1);
    document.getElementById('playerTwoInitialScore').classList.toggle('active-player', currentPlayer === 2);
}

// Function to delete the last entered number
function deleteLastNumber() {
    if (numbersEntered.length > 0) {
        numbersEntered.pop();
        displayConcatenatedNumbers();
        if (!isMobileDevice()) {
            document.getElementById('numberInput').focus();
        }
    }

    // If there are no numbers left, restore the previous score for both players
    if (numbersEntered.length === 0 && scoreHistory.length > 1) {
        scoreHistory.pop();
        initialScore = { ...scoreHistory[scoreHistory.length - 1] };
        updateScoreDisplay();
    }
}

// Function to clear the input area
function clearInput() {
    numbersEntered = [];
    displayConcatenatedNumbers();
}

// Function to handle keyboard input and keep focus (desktop only)
function handleKeyboardInput(event) {
    const value = event.target.value;

    // Validate input (only numbers 0-9)
    if (/^\d*$/.test(value)) {
        numbersEntered = value.split('');
    } else {
        event.target.value = numbersEntered.join('');
    }

    document.getElementById('numberInput').focus();
}

// Listen for the 'Enter' key on the input field (desktop only)
if (!isMobileDevice()) {
    document.getElementById('numberInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            updateScore();
        }
    });
}

// Function to update the score
function updateScore() {
    const concatenatedNumber = parseInt(numbersEntered.join(''));

    if (isNaN(concatenatedNumber)) {
        M.Modal.getInstance(document.getElementById('nanModal')).open();
        return;
    }

    if (concatenatedNumber > 180) {
        M.Modal.getInstance(document.getElementById('tooHighModal')).open();
        return;
    }

    const newScore = initialScore[currentPlayer] - concatenatedNumber;

    if (newScore < 0) {
        M.Modal.getInstance(document.getElementById('minusModal')).open();
    } else {
        // Store the previous score before updating
        scoreHistory.push({ ...initialScore });

        // Update the current player's score
        initialScore[currentPlayer] = newScore;
        totalPoints[currentPlayer] += concatenatedNumber;

        // Clear input field
        numbersEntered = [];
        displayConcatenatedNumbers();

        // Check for win condition
        if (newScore === 0) {
            updateScoreDisplay(); // Ensure UI updates before showing win modal

            // Update the modal content with the correct winning player
            document.querySelector("#checkoutModal .modal-content p").innerText = `Congratulations, Player ${currentPlayer} wins!`;

            M.Modal.getInstance(document.getElementById('checkoutModal')).open();
            return;
        }

        // Switch player BEFORE updating the UI
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        // Now update the display, ensuring the highlight is correct
        updateScoreDisplay();
    }
}

// Start the game on page load
startGame();
