const cells = document.querySelectorAll('.cell');
const status = document.querySelector('.status');
const resetBtn = document.getElementById('resetBtn');
const winnerModal = document.getElementById('winnerModal');
const winnerText = document.getElementById('winnerText');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Track statistics
let statistics = {
    X: { wins: 0, draws: 0 },
    O: { wins: 0, draws: 0 }
};

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[index] !== '' || !gameActive) return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        gameActive = false;
        statistics[currentPlayer].wins++;
        updatePlayerProfiles();
        announceWinner();
    } else if (checkDraw()) {
        gameActive = false;
        statistics.X.draws++;
        statistics.O.draws++;
        updatePlayerProfiles();
        showDrawMessage();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function announceWinner() {
    winnerText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    winnerModal.classList.add('show');
    status.textContent = `Player ${currentPlayer} Wins!`;
    fireConfetti();
}

function showDrawMessage() {
    winnerText.textContent = "It's a Draw! 🤝";
    winnerModal.classList.add('show');
    status.textContent = "It's a Draw!";
}

function fireConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
    
    // Configure confetti
    const myConfetti = confetti.create(null, {
        resize: true,
        useWorker: true,
        zIndex: 9999
    });
    
    // First burst
    myConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        shapes: ['square', 'circle'],
        scalar: 1.2,
        disableForReducedMotion: true,
        zIndex: 9999
    });

    // Side bursts
    setTimeout(() => {
        // Left burst
        myConfetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: colors,
            zIndex: 9999
        });
        // Right burst
        myConfetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: colors,
            zIndex: 9999
        });
    }, 200);

    // Final burst
    setTimeout(() => {
        myConfetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.7 },
            colors: colors,
            zIndex: 9999
        });
    }, 400);

    // Cleanup
    setTimeout(() => {
        myConfetti.reset();
    }, 4000);
}

function updatePlayerProfiles() {
    document.querySelector('.wins-x').textContent = statistics.X.wins;
    document.querySelector('.draws-x').textContent = statistics.X.draws;
    document.querySelector('.wins-o').textContent = statistics.O.wins;
    document.querySelector('.draws-o').textContent = statistics.O.draws;
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    status.textContent = `Player ${currentPlayer}'s Turn`;
    winnerModal.classList.remove('show');
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

// Close modal when clicking outside
winnerModal.addEventListener('click', (e) => {
    if (e.target === winnerModal) {
        resetGame();
    }
});
