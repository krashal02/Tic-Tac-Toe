const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('modeSelect');
const gameArea = document.getElementById('gameArea');
const clickSound = document.getElementById('click-sound');

let currentPlayer = 'X';
let gameActive = true;
let cells = Array(9).fill(null);
let mode = 'friend';

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function startGame(selectedMode) {
  playClickSound();
  mode = selectedMode;
  modeSelect.classList.add('hidden');
  gameArea.classList.remove('hidden');
  resetGame();
}

function createBoard() {
  board.innerHTML = '';
  cells.forEach((cell, index) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.index = index;
    div.addEventListener('click', handleMove);
    div.textContent = cell || '';
    board.appendChild(div);
  });
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  playClickSound();
  makeMove(index, currentPlayer);

  if (checkWin(currentPlayer)) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell)) {
    statusText.textContent = "😮 It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Current Turn: ${currentPlayer}`;

  if (mode === 'computer' && currentPlayer === 'O' && gameActive) {
    setTimeout(computerMove, 400);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  if (cell) cell.textContent = player;
}

function checkWin(player) {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a] === player && cells[b] === player && cells[c] === player;
  });
}

function computerMove() {
  // 1. Try to win
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = 'O';
      if (checkWin('O')) {
        makeMove(i, 'O');
        statusText.textContent = "🤖 Computer Wins!";
        gameActive = false;
        return;
      }
      cells[i] = null;
    }
  }

  // 2. Block opponent
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = 'X';
      if (checkWin('X')) {
        cells[i] = 'O';
        makeMove(i, 'O');
        currentPlayer = 'X';
        statusText.textContent = `Current Turn: ${currentPlayer}`;
        return;
      }
      cells[i] = null;
    }
  }

  // 3. Random move
  let emptyIndices = cells.map((v, i) => v ? null : i).filter(i => i !== null);
  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, 'O');

  if (checkWin('O')) {
    statusText.textContent = "🤖 Computer Wins!";
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell)) {
    statusText.textContent = "😮 It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Current Turn: ${currentPlayer}`;
}

function resetGame() {
  playClickSound();
  currentPlayer = 'X';
  gameActive = true;
  cells = Array(9).fill(null);
  statusText.textContent = `Current Turn: ${currentPlayer}`;
  createBoard();
}

resetBtn.addEventListener('click', resetGame);
