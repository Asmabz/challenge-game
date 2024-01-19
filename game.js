const gridWidth = 10;
const gridHeight = 20;
let gameGrid = createEmptyGrid();

// Tetromino shapes and colors
const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [1]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 1], [0, 1]], // T
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1]], // S
    [[1, 1, 1], [1, 0]], // Z
];
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500']; // Red, Green, Blue, Yellow, Purple, Cyan, Orange

let currentTetromino;
let currentColor;
let currentX = 0;
let currentY = 0;

function startGame() {
    spawnTetromino();
    setInterval(gameLoop, 1000); // Game loop every 1000ms (1 second)
}

function gameLoop() {
    moveTetrominoDown();
    updateGame();
}

function handleInput(event) {
    if (event.key === 'ArrowLeft') moveTetromino('left');
    else if (event.key === 'ArrowRight') moveTetromino('right');
    else if (event.key === 'ArrowDown') moveTetrominoDown();
    else if (event.key === 'ArrowUp') rotateTetromino();
}

function rotateTetromino() {
    const rotated = rotateMatrix(currentTetromino);
    if (isValidMove(rotated, currentX, currentY)) {
        currentTetromino = rotated;
        updateGame();
    }
}

function moveTetromino(direction) {
    const newX = direction === 'left' ? currentX - 1 : currentX + 1;
    if (isValidMove(currentTetromino, newX, currentY)) {
        currentX = newX;
        updateGame();
    }
}

function moveTetrominoDown() {
    const newY = currentY + 1;
    if (isValidMove(currentTetromino, currentX, newY)) {
        currentY = newY;
        updateGame();
    } else {
        mergeTetromino();
        clearLines();
        spawnTetromino();
        updateGame();
    }
}

function mergeTetromino() {
    for (let y = 0; y < currentTetromino.length; y++) {
        for (let x = 0; x < currentTetromino[y].length; x++) {
            if (currentTetromino[y][x]) {
                gameGrid[currentY + y][currentX + x] = currentColor;
            }
        }
    }
}

function clearLines() {
    for (let y = gridHeight - 1; y >= 0; y--) {
        if (gameGrid[y].every(cell => cell !== 0)) {
            gameGrid.splice(y, 1);
            gameGrid.unshift(Array(gridWidth).fill(0));
        }
    }
}

function isValidMove(tetromino, x, y) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col] && (gameGrid[y + row] && gameGrid[y + row][x + col]) !== 0) {
                return false;
            }
        }
    }
    return true;
}

function spawnTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    currentTetromino = tetrominos[randomIndex];
    currentColor = colors[randomIndex];
    currentX = Math.floor((gridWidth - currentTetromino[0].length) / 2);
    currentY = 0;
    if (!isValidMove(currentTetromino, currentX, currentY)) {
        // Game over logic can go here
    }
}

function updateGame() {
    const gameGridElement = document.getElementById('game-grid');
    gameGridElement.innerHTML = '';

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.backgroundColor = gameGrid[y][x] || '#f0e68c'; // Default to Krusty Krab light khaki color
            gameGridElement.appendChild(cell);
        }
    }
}

function rotateMatrix(matrix) {
    const result = matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
    return result;
}

function createEmptyGrid() {
    return Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));
}

document.addEventListener('keydown', handleInput);
document.addEventListener('DOMContentLoaded', startGame);
