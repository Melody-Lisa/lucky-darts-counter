// Dart values setup for standard numbers plus bullseye and outer bull
let dartValues = Array.from({ length: 20 }, (_, i) => i + 1).concat([25, 50]);

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
    if (target <= 20) {
        buttonContainer.appendChild(createButton(`S${target}`, target, 1));
        buttonContainer.appendChild(createButton(`D${target}`, target, 2));
        buttonContainer.appendChild(createButton(`T${target}`, target, 3));
    } else {
        // Create buttons for outer bull (25) and bull (50)
        if (target === 25) {
            buttonContainer.appendChild(createButton("Outer Bull", 25, 1));
        } else if (target === 50) {
            buttonContainer.appendChild(createButton("Bull", 50, 1));
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
    if ((target === 25 && playerTarget === 25) || (target === 50 && playerTarget === 50) || target === playerTarget) {
        if (multiplier === 1) playerTargets[currentPlayer]++;   // S = move to next target
        if (multiplier === 2) playerTargets[currentPlayer] += 2; // D = move 2 targets forward
        if (multiplier === 3) playerTargets[currentPlayer] += 3; // T = move 3 targets forward
    }

    // Special targets for outer bull and bull
    if (playerTargets[currentPlayer] > 20) {
        playerTargets[currentPlayer] = 25;  // Outer bull when past 20
    } 
    if (playerTargets[currentPlayer] === 26) {
        playerTargets[currentPlayer] = 50;  // Bull after outer bull
    }

    // Update dart count and switch player if needed
    playerDarts[currentPlayer]--;
    if (playerTargets[currentPlayer] === 50 && multiplier === 1) {
        alert(`Player ${currentPlayer} wins!`);
        restartGame();
        return;
    }
    if (playerDarts[currentPlayer] === 0) switchPlayer();
    updateDisplay();
}

// Switch current player after 3 darts
function switchPlayer() {
    playerDarts[currentPlayer] = 3;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Update the display for current scores and player targets
function updateDisplay() {
    document.getElementById('playerOneInitialScore').innerText = `Target: ${playerTargets[1]}`;
    document.getElementById('playerTwoInitialScore').innerText = `Target: ${playerTargets[2]}`;
    document.getElementById('initialScore').innerText = `Player ${currentPlayer} - Darts Left: ${playerDarts[currentPlayer]}`;

    displayDartButtons(playerTargets[currentPlayer]);

    // Highlight the active player
    document.getElementById('playerOneInitialScore').classList.toggle('active-player', currentPlayer === 1);
    document.getElementById('playerTwoInitialScore').classList.toggle('active-player', currentPlayer === 2);
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
