const cells = document.querySelectorAll('.cell');
const status = document.querySelector('.status');
const resetBtn = document.getElementById('resetBtn');
const winnerModal = document.getElementById('winnerModal');
const winnerText = document.getElementById('winnerText');
const moveSound = new Audio('sounds/move.mp3');
const winSound = new Audio('sounds/win.mp3');
const drawSound = new Audio('sounds/drawSound.mp3');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let statistics = {
    X: { wins: 0, draws: 0 },
    O: { wins: 0, draws: 0 }
};

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function updatePlayerProfiles() {
    document.querySelector('.wins-x').textContent = statistics.X.wins;
    document.querySelector('.draws-x').textContent = statistics.X.draws;
    document.querySelector('.wins-o').textContent = statistics.O.wins;
    document.querySelector('.draws-o').textContent = statistics.O.draws;

    // Update active player highlight
    document.querySelector('.player-x').classList.toggle('active', currentPlayer === 'X');
    document.querySelector('.player-o').classList.toggle('active', currentPlayer === 'O');
}

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[index] !== '' || !gameActive) return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    moveSound.currentTime = 0;
    moveSound.play();

    if (checkWin()) {
        winSound.play();
        statistics[currentPlayer].wins++;
        updatePlayerProfiles();
        announceWinner(`${currentPlayer} Wins! 🎉`);
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        drawSound.play();
        statistics.X.draws++;
        statistics.O.draws++;
        updatePlayerProfiles();
        announceWinner("It's a Draw! 🤝");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s Turn`;
    updatePlayerProfiles();
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

function announceWinner(message) {
    winnerText.textContent = message;
    winnerModal.classList.add('show');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
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
    updatePlayerProfiles();
}

function fireConfetti() {
    // Configure confetti to appear above modal
    const canvasConfetti = confetti.create(null, {
        resize: true,
        useWorker: true,
        zIndex: 999999
    });

    // First burst
    canvasConfetti({
        particleCount: 80,
        spread: 55,
        origin: { y: 0.5 },
        zIndex: 999999
    });

    // Multiple bursts
    const count = 150;
    const defaults = {
        origin: { y: 0.5 }
    };

    function fire(particleRatio, opts) {
        canvasConfetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
            zIndex: 999999
        }));
    }

    fire(0.25, {
        spread: 20,
        startVelocity: 45
    });

    fire(0.2, {
        spread: 45
    });

    fire(0.35, {
        spread: 80,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 100,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 90,
        startVelocity: 35
    });

    // Cleanup
    setTimeout(() => {
        canvasConfetti.reset();
    }, 4000);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
winnerModal.addEventListener('click', (e) => {
    if (e.target === winnerModal) {
        resetGame();
    }
});
updatePlayerProfiles(); // Initialize profiles
