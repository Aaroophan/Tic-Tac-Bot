import { GameCell, Player, MoveHistoryItem } from '../types/game';

// Check if there's a winner in the given board
export function checkWinner(board: GameCell[]): Player | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }

  return null;
}

// Check if the game is approaching a draw (only one empty space left)
export function isApproachingDraw(board: GameCell[]): boolean {
  return board.filter(cell => cell === Player.NONE).length === 1;
}

// Check if the game is a draw
export function checkDraw(board: GameCell[]): boolean {
  return !checkWinner(board) && board.every(cell => cell !== Player.NONE);
}

// Get all available moves for the current board
export function getAvailableMoves(board: GameCell[]): number[] {
  return board
    .map((cell, index) => cell === Player.NONE ? index : -1)
    .filter(index => index !== -1);
}

// Make a move on the board and return a new board
export function makeMove(board: GameCell[], index: number, player: Player): GameCell[] {
  const newBoard = [...board];
  if (newBoard[index] === Player.NONE) {
    newBoard[index] = player;
  }
  return newBoard;
}

// Remove the earliest move from the board
export function removeEarliestMove(board: GameCell[], moveHistory: MoveHistoryItem[]): {
  newBoard: GameCell[];
  newHistory: MoveHistoryItem[];
} {
  if (moveHistory.length === 0) return { newBoard: board, newHistory: moveHistory };

  const earliestMove = moveHistory[0];
  const newBoard = [...board];
  newBoard[earliestMove.position] = Player.NONE;

  return {
    newBoard,
    newHistory: moveHistory.slice(1)
  };
}

// Evaluate the board state for the minimax algorithm
export function evaluateBoard(board: GameCell[], player: Player): number {
  const winner = checkWinner(board);
  
  if (winner === player) {
    return 10;
  } else if (winner && winner !== player) {
    return -10;
  } else if (checkDraw(board)) {
    return 0;
  }
  
  // No winner yet, evaluate position
  return 0;
}

// Check if there's a repeated pattern in the move history
export function checkRepeatedPattern(moveHistory: MoveHistoryItem[]): boolean {
  if (moveHistory.length < 24) return false; // Need at least 3 sets of 8 moves

  // Get the last 24 moves (3 sets of 8 moves)
  const last24Moves = moveHistory.slice(-24);
  
  // Create pattern strings that include both position and player
  const createPatternString = (moves: MoveHistoryItem[]) => {
    return moves.map(move => `${move.position}-${move.player}`).join(',');
  };
  
  // Get patterns for each set of 8 moves
  const pattern1 = createPatternString(last24Moves.slice(0, 8));
  const pattern2 = createPatternString(last24Moves.slice(8, 16));
  const pattern3 = createPatternString(last24Moves.slice(16, 24));
  
  // Log patterns for debugging
  console.log('Pattern 1:', pattern1);
  console.log('Pattern 2:', pattern2);
  console.log('Pattern 3:', pattern3);
  
  // Compare patterns
  const isPattern = pattern1 === pattern2 && pattern2 === pattern3;
  console.log('Is pattern repeated:', isPattern);
  
  return isPattern;
}