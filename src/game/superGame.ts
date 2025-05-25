import { GameCell, Player, SuperBoard } from '../types/game';
import { checkWinner, checkDraw } from './classicGame';

// Initialize a Super Tic Tac Toe board
export function initSuperBoard(): SuperBoard {
  return {
    boards: Array(9).fill(null).map(() => Array(9).fill(Player.NONE)),
    mainBoard: Array(9).fill(Player.NONE),
    activeBoard: null,  // null means any board can be played in (first move)
    lastMove: null
  };
}

// Check if there's a winner in the Super Tic Tac Toe game
export function checkSuperWinner(superState: SuperBoard): Player | null {
  return checkWinner(superState.mainBoard);
}

// Check if the Super Tic Tac Toe game is a draw
export function checkSuperDraw(superState: SuperBoard): boolean {
  return checkDraw(superState.mainBoard);
}

// Make a move in the Super Tic Tac Toe game
export function makeValidMove(
  superState: SuperBoard, 
  boardIndex: number, 
  cellIndex: number, 
  player: Player
): SuperBoard {
  // Check if the move is valid
  if (
    (superState.activeBoard !== null && superState.activeBoard !== boardIndex) ||
    superState.boards[boardIndex][cellIndex] !== Player.NONE ||
    checkWinner(superState.boards[boardIndex]) !== null
  ) {
    return superState;
  }

  // Create a copy of the state
  const newSuperState: SuperBoard = {
    boards: superState.boards.map(board => [...board]),
    mainBoard: [...superState.mainBoard],
    activeBoard: null,
    lastMove: { board: boardIndex, cell: cellIndex }
  };

  // Make the move
  newSuperState.boards[boardIndex][cellIndex] = player;

  // Check if the sub-board has a winner or is a draw after this move
  const boardWinner = checkWinner(newSuperState.boards[boardIndex]);
  if (boardWinner) {
    newSuperState.mainBoard[boardIndex] = boardWinner;
  } else if (checkDraw(newSuperState.boards[boardIndex])) {
    newSuperState.mainBoard[boardIndex] = Player.NONE; // Represent a draw in the main board
  }

  // Determine the next active board
  // If the corresponding board is already won or full, player can choose any board
  if (
    newSuperState.mainBoard[cellIndex] !== Player.NONE ||
    checkDraw(newSuperState.boards[cellIndex])
  ) {
    newSuperState.activeBoard = null;
  } else {
    newSuperState.activeBoard = cellIndex;
  }

  return newSuperState;
}

// Get all valid moves for the current Super Tic Tac Toe state
export function getValidSuperMoves(superState: SuperBoard): { boardIndex: number; cellIndex: number }[] {
  const moves: { boardIndex: number; cellIndex: number }[] = [];

  // If activeBoard is null, player can choose any board that isn't already won
  const boardsToCheck = superState.activeBoard !== null 
    ? [superState.activeBoard] 
    : Array(9).fill(null).map((_, i) => i);

  for (const boardIndex of boardsToCheck) {
    // Skip if the board is already won or is a draw
    if (superState.mainBoard[boardIndex] !== Player.NONE) {
      continue;
    }

    // Check each cell in the board
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (superState.boards[boardIndex][cellIndex] === Player.NONE) {
        moves.push({ boardIndex, cellIndex });
      }
    }
  }

  return moves;
}

// Evaluate the Super Tic Tac Toe board for the minimax algorithm
export function evaluateSuperBoard(superState: SuperBoard, player: Player): number {
  const winner = checkSuperWinner(superState);
  
  if (winner === player) {
    return 100;
  } else if (winner && winner !== player) {
    return -100;
  } else if (checkSuperDraw(superState)) {
    return 0;
  }
  
  // No winner yet, evaluate position heuristically
  let score = 0;
  
  // Count mini-boards won
  for (let i = 0; i < 9; i++) {
    if (superState.mainBoard[i] === player) {
      score += 10;
    } else if (superState.mainBoard[i] && superState.mainBoard[i] !== player) {
      score -= 10;
    }
  }
  
  // Bonus for controlling the center board
  if (superState.mainBoard[4] === player) {
    score += 5;
  } else if (superState.mainBoard[4] && superState.mainBoard[4] !== player) {
    score -= 5;
  }
  
  // Value strategic positions in each mini-board
  for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
    const board = superState.boards[boardIndex];
    if (superState.mainBoard[boardIndex] === Player.NONE) {
      // Center position in each board
      if (board[4] === player) score += 3;
      else if (board[4] && board[4] !== player) score -= 3;
      
      // Corner positions
      for (const corner of [0, 2, 6, 8]) {
        if (board[corner] === player) score += 2;
        else if (board[corner] && board[corner] !== player) score -= 2;
      }
    }
  }
  
  return score;
}