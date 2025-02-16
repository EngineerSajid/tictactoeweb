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
    
    // Play move sound
    moveSound.currentTime = 0;
    moveSound.play();

    if (checkWin()) {
        gameActive = false;
        winSound.currentTime = 0;
        winSound.play();
        announceWinner();
    } else if (checkDraw()) {
        gameActive = false;
        drawSound.currentTime = 0;
        drawSound.play();
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
    
    // Trigger confetti animation
    fireConfetti();
    
    const winningCombination = winningCombinations.find(combination => {
        return combination.every(index => gameBoard[index] === currentPlayer);
    });
    
    // Highlight winning cells
    winningCombination.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function showDrawMessage() {
    winnerText.textContent = "It's a Draw! 🤝";
    winnerModal.classList.add('show');
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

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s Turn`;
    winnerModal.classList.remove('show');
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
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
