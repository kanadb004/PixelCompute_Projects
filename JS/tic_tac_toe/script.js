const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('reset-btn');
const winnerText = document.getElementById('winner-text');

let clickCount = 0;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', function() {
        if (!gameActive) return;
        
        const index = this.getAttribute('data-index');
        
        if (gameBoard[index] !== '') return;
        
        clickCount++;
        
        const player = clickCount % 2 === 1 ? 'X' : 'O';
        
        gameBoard[index] = player;
        
        const icon = document.createElement('i');
        icon.className = player === 'X' ? 'fa-solid fa-x' : 'fa-solid fa-o';
        this.innerHTML = '';
        this.appendChild(icon);
        
        checkWinner();
    });
});

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[b] && gameBoard[c] && 
            gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            
            const winner = gameBoard[a];
            winnerText.textContent = `${winner} wins!`;
            
            cells[a].classList.add('lightgreen');
            cells[b].classList.add('lightgreen');
            cells[c].classList.add('lightgreen');
            
            gameActive = false;
            return;
        }
    }
    
    if (clickCount === 9) {
        winnerText.textContent = "It's a Tie!";
        gameActive = false;
    }
}

resetBtn.addEventListener('click', function() {
    clickCount = 0;
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    winnerText.textContent = '';
    
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('lightgreen');
    });
});
