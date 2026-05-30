let gameState = {
    gridSize: 4,
    totalCells: 16,
    totalShips: 5,
    maxClicks: 8,
    clicks: 0,
    shipsFound: 0,
    gameOver: false,
    shipPositions: [],
    revealedCells: new Set()
};

function generateShipPositions() {
    gameState.shipPositions = [];
    while (gameState.shipPositions.length < gameState.totalShips) {
        const randomPosition = Math.floor(Math.random() * gameState.totalCells);
        if (!gameState.shipPositions.includes(randomPosition)) {
            gameState.shipPositions.push(randomPosition);
        }
    }
}

function renderGrid() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';

    for (let i = 0; i < gameState.totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', (e) => handleCellClick(e, i));

        const img = document.createElement('img');
        img.src = gameState.shipPositions.includes(i) ? 'ship.png' : 'water.png';
        img.alt = gameState.shipPositions.includes(i) ? 'Ship' : 'Water';
        cell.appendChild(img);

        gameGrid.appendChild(cell);
    }
}

function handleCellClick(event, index) {
    if (gameState.gameOver || gameState.revealedCells.has(index)) {
        return;
    }

    gameState.revealedCells.add(index);
    gameState.clicks++;

    const cell = event.currentTarget;
    cell.classList.add('revealed');

    if (gameState.shipPositions.includes(index)) {
        gameState.shipsFound++;
    }

    checkGameStatus();
}

function checkGameStatus() {
    if (gameState.shipsFound === gameState.totalShips && gameState.clicks <= gameState.maxClicks) {
        endGame(true);
    } else if (gameState.clicks >= gameState.maxClicks && gameState.shipsFound < gameState.totalShips) {
        endGame(false);
    }
}

function endGame(won) {
    gameState.gameOver = true;
    const message = won ? 'You Won!' : 'You Lost!';
    setTimeout(() => {
        alert(message);
    }, 300);
}

function resetGame() {
    gameState.clicks = 0;
    gameState.shipsFound = 0;
    gameState.gameOver = false;
    gameState.revealedCells.clear();
    initializeGame();
}

function initializeGame() {
    generateShipPositions();
    renderGrid();
}

function setupEventListeners() {
    document.getElementById('resetBtn').addEventListener('click', () => {
        resetGame();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});
