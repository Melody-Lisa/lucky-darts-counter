// Dart values setup for standard numbers plus bullseye and outer bull
let dartValues = Array.from({ length: 25 }, (_, i) => i + 1);

// Player-specific states
let currentPlayer = 1;
let playerTargets = { 1: 1, 2: 1 };  // Initial target number for both players
let playerDarts = { 1: 3, 2: 3 };    // Dart count per turn
let playerScores = { 1: 0, 2: 0 };   // Keep track of each player's score history

// Display function to create buttons dynamically based on the target
function displayDartButtons(target) {
    const buttonContainer = document.getElementById('dartButtons');
    buttonContainer.innerHTML = '';

    // Create S, D, T, and Miss buttons for standard values
    if (target <= 18) {
        buttonContainer.appendChild(createButton(`S${target}`, target, 1));
        buttonContainer.appendChild(createButton(`D${target}`, target, 2));
        buttonContainer.appendChild(createButton(`T${target}`, target, 3));
    } else {
        if (target === 19) {
            buttonContainer.appendChild(createButton(`S${target}`, target, 1));
            buttonContainer.appendChild(createButton(`D${target}`, target, 2));
            buttonContainer.appendChild(createButton(`T${target}`, target, 1));
        } else if (target === 20) {
            buttonContainer.appendChild(createButton(`S${target}`, target, 1));
            buttonContainer.appendChild(createButton(`D${target}`, target, 1));
            buttonContainer.appendChild(createButton(`T${target}`, target, 1));
        } else if (target === 21) {
            buttonContainer.appendChild(createButton("D20", 21, 1));
        } else if (target === 22) {
            buttonContainer.appendChild(createButton("T20", 22, 1));
        } else if (target === 23) {
            buttonContainer.appendChild(createButton("Outer Bull", 23, 1));
        } else if (target === 24) {
        buttonContainer.appendChild(createButton("Bull", 24, 1));
    }
}
buttonContainer.appendChild(createButton("Miss", target, 0));
}

// Button creation helper function
function createButton(label, target, multiplier) {
    const button = document.createElement('button');
    button.classList.add('waves-effect', 'waves-light', 'num-pad-btn', 'grey', 'darken-4');
    button.innerText = label;

    button.onclick = () => handleHit(target, multiplier);
    return button;
}

// Handles each dart hit based on current player, target, and multiplier
function handleHit(target, multiplier) {
    const hitValue = target * multiplier;
    let playerTarget = playerTargets[currentPlayer];

    // Check if hit is the target
    if (target === playerTarget) {
        if (multiplier === 1) playerTargets[currentPlayer]++;   // S = move to next target
        if (multiplier === 2) playerTargets[currentPlayer] += 2; // D = move 2 targets forward
        if (multiplier === 3) playerTargets[currentPlayer] += 3; // T = move 3 targets forward
    }

    // Update dart count and check win condition
    playerDarts[currentPlayer]--;
    if (playerTargets[currentPlayer] === 25) {
        alert(`Player ${currentPlayer} wins!`);
        restartGame();
        return;
    }

    // Switch player if darts are used up
    if (playerDarts[currentPlayer] === 0) switchPlayer();
    updateDisplay();
}

// Switch current player after 3 darts
function switchPlayer() {
    playerDarts[currentPlayer] = 3;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateDisplay() {
    // Map for special dart values
    const targetLabels = {
        21: "D20",
        22: "T20",
        23: "Outer Bull",
        24: "Bull"
    };

    // Get current target labels based on player targets
    const playerOneTarget = targetLabels[playerTargets[1]] || playerTargets[1];
    const playerTwoTarget = targetLabels[playerTargets[2]] || playerTargets[2];

    // Update the display with the target labels
    document.getElementById('playerOneInitialScore').innerText = `${playerOneTarget}`;
    document.getElementById('playerTwoInitialScore').innerText = `${playerTwoTarget}`;
    document.getElementById('initialScore').innerText = `Player ${currentPlayer} - Darts Left: ${playerDarts[currentPlayer]}`;

    displayDartButtons(playerTargets[currentPlayer]);

    // Highlight the active player
    document.getElementById('playerOne').classList.toggle('active-player', currentPlayer === 1);
    document.getElementById('playerTwo').classList.toggle('active-player', currentPlayer === 2);
}

// Restart game setup
function restartGame() {
    currentPlayer = 1;
    playerTargets = { 1: 1, 2: 1 };
    playerDarts = { 1: 3, 2: 3 };
    updateDisplay();
}

// Initial display setup
updateDisplay();
