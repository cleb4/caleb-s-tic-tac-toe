// Array to track the game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let aiPlayer = 'O';
let humanPlayer = 'X';

// Function to handle cell clicks for human player
function handleCellClick(index) {
  if (board[index] === '' && isGameActive) {
    board[index] = humanPlayer;
    document.getElementById(`cell-${index}`).innerText = humanPlayer;
    document.getElementById(`cell-${index}`).classList.add(humanPlayer === 'X' ? 'x' : 'o');
    checkWinner();
    if (isGameActive) {
      switchTurn();
      makeAIMove();
    }
  }
}

// Function to switch players
function switchTurn() {
  currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
  document.getElementById('turn').innerText = currentPlayer === humanPlayer ? 'Your Turn' : 'AI\'s Turn';
}

// Function to check for a winner
function checkWinner() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      isGameActive = false;
      document.getElementById('turn').innerText = board[a] === humanPlayer ? 'You Win!' : 'AI Wins!';
      highlightWinnerCells(condition);
      break;
    }
  }

  if (!board.includes('') && isGameActive) {
    isGameActive = false;
    document.getElementById('turn').innerText = 'It\'s a Tie!';
  }
}

// Function to highlight winning cells
function highlightWinnerCells(condition) {
  for (let index of condition) {
    document.getElementById(`cell-${index}`).classList.add('winner');
  }
}

// Function to make AI move using the min-max algorithm
function makeAIMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false);
      board[i] = '';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  board[bestMove] = aiPlayer;
  document.getElementById(`cell-${bestMove}`).innerText = aiPlayer;
  document.getElementById(`cell-${bestMove}`).classList.add(aiPlayer === 'X' ? 'x' : 'o');
  checkWinner();
  switchTurn();
}

// Minimax function for AI move evaluation
function minimax(board, depth, isMaximizing) {
  if (checkWinningCondition(board, humanPlayer)) {
    return -1;
  } else if (checkWinningCondition(board, aiPlayer)) {
    return 1;
  } else if (!board.includes('')) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = aiPlayer;
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = humanPlayer;
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Function to check for a winning condition
function checkWinningCondition(board, player) {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }

  return false;
}

// Add event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

// Display initial player's turn
document.getElementById('turn').innerText = 'Your Turn';
