// DOM elements
const buttons = document.querySelectorAll(".btns");
const resetBtn = document.querySelector(".resetbtn");
const resetScoresBtn = document.getElementById("reset-scores");
const playerForm = document.getElementById("player-form");
const gameBoard = document.getElementById("game-board");
const startGameBtn = document.getElementById("start-game");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const currentPlayerSpan = document.getElementById("current-player");
const player1NameSpan = document.getElementById("player1-name");
const player2NameSpan = document.getElementById("player2-name");
const player1ScoreSpan = document.getElementById("player1-score");
const player2ScoreSpan = document.getElementById("player2-score");
const drawsSpan = document.getElementById("draws");
const resultMessage = document.getElementById("result-message");

// Game state
let playerX = true;
let gameActive = true;
let clickCount = 0;
let player1Name = "";
let player2Name = "";
let scores = {
    player1: 0,
    player2: 0,
    draws: 0
};

// Winning patterns
const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
];

// Load saved data on page load
window.addEventListener("DOMContentLoaded", () => {
    loadSavedData();
});

// Load saved player names and scores
function loadSavedData() {
    // Load player names
    const savedPlayer1 = localStorage.getItem("player1Name");
    const savedPlayer2 = localStorage.getItem("player2Name");
    
    if (savedPlayer1 && savedPlayer2) {
        player1Input.value = savedPlayer1;
        player2Input.value = savedPlayer2;
    }
    
    // Load scores
    const savedScores = localStorage.getItem("tictactoeScores");
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

// Start game button event
startGameBtn.addEventListener("click", () => {
    player1Name = player1Input.value.trim() || "Player X";
    player2Name = player2Input.value.trim() || "Player O";
    
    // Save to localStorage
    localStorage.setItem("player1Name", player1Name);
    localStorage.setItem("player2Name", player2Name);
    
    // Update display
    player1NameSpan.textContent = player1Name;
    player2NameSpan.textContent = player2Name;
    
    // Hide form, show game board
    playerForm.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    
    // Reset game and update display
    reset();
    updatePlayerTurn();
});

// Update the current player display
function updatePlayerTurn() {
    currentPlayerSpan.textContent = playerX ? player1Name : player2Name;
    currentPlayerSpan.className = playerX ? "x" : "o";
}

// Update score display
function updateScoreDisplay() {
    player1ScoreSpan.textContent = scores.player1;
    player2ScoreSpan.textContent = scores.player2;
    drawsSpan.textContent = scores.draws;
}

// Button click event
buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        if (gameActive && button.textContent === "") {
            // Set X or O based on current player
            if (playerX) {
                button.textContent = "X";
                button.classList.add("x");
            } else {
                button.textContent = "O";
                button.classList.add("o");
            }
            
            clickCount++;
            
            // Check for winner
            const winningPattern = checkWinner();
            if (winningPattern) {
                gameActive = false;
                const winner = playerX ? player1Name : player2Name;
                const symbol = playerX ? "X" : "O";
                
                // Update scores
                if (playerX) {
                    scores.player1++;
                } else {
                    scores.player2++;
                }
                
                // Save scores
                saveScores();
                
                // Update score display
                updateScoreDisplay();
                
                // Highlight winning cells
                highlightWinningCells(winningPattern);
                
                // Show result message
                showResult(`${winner} (${symbol}) wins!`, playerX ? 'win-x' : 'win-o');
                
            } else if (clickCount === 9) {
                // It's a draw
                scores.draws++;
                saveScores();
                updateScoreDisplay();
                showResult("It's a draw!", 'draw');
            } else {
                // Switch player and update display
                playerX = !playerX;
                updatePlayerTurn();
            }
        }
    });
});

// Check for winner
function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            buttons[a].textContent &&
            buttons[a].textContent === buttons[b].textContent &&
            buttons[b].textContent === buttons[c].textContent
        ) {
            return pattern; // Return the winning pattern
        }
    }
    return null;
}

// Highlight winning cells
function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        buttons[index].classList.add('winning-cell');
    });
}

// Show result message
function showResult(message, className) {
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${className}`;
    resultMessage.classList.remove('hidden');
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem("tictactoeScores", JSON.stringify(scores));
}

// Reset game
function reset() {
    buttons.forEach((button) => {
        button.textContent = "";
        button.classList.remove("x", "o", "winning-cell");
    });
    
    clickCount = 0;
    playerX = true;
    gameActive = true;
    resultMessage.classList.add('hidden');
    updatePlayerTurn();
}

// Reset scores
function resetScores() {
    scores = {
        player1: 0,
        player2: 0,
        draws: 0
    };
    saveScores();
    updateScoreDisplay();
}

// Reset button event
resetBtn.addEventListener("click", reset);

// Reset scores button event
resetScoresBtn.addEventListener("click", resetScores);
