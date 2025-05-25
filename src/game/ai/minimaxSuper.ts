import { Player, SuperBoard } from '../../types/game';
import { 
  checkSuperWinner, 
  checkSuperDraw, 
  getValidSuperMoves, 
  makeValidMove, 
  evaluateSuperBoard 
} from '../superGame';

// Main function to get the AI move for Super Tic Tac Toe
export function getSuperAIMove(
  superState: SuperBoard, 
  player: Player, 
  depth: number
): { boardIndex: number; cellIndex: number } {
  const validMoves = getValidSuperMoves(superState);
  
  if (validMoves.length === 0) {
    return { boardIndex: null, cellIndex: null };
  }
  
  // If this is the first move or few moves, consider randomizing for variety
  if (
    superState.boards.every(board => board.every(cell => cell === Player.NONE)) ||
    (depth > 0 && Math.random() < 0.1) // 10% chance for non-first moves to add variety
  ) {
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return randomMove;
  }
  
  let bestScore = -Infinity;
  let bestMove = validMoves[0];
  
  // Using alpha-beta pruning for efficiency
  for (const move of validMoves) {
    const newState = makeValidMove(
      superState, 
      move.boardIndex, 
      move.cellIndex, 
      player
    );
    
    // For Super Tic Tac Toe, we use a more heuristic-based evaluation
    const score = minimaxSuper(
      newState, 
      depth, 
      false, 
      player, 
      -Infinity, 
      Infinity
    );
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Minimax algorithm adapted for Super Tic Tac Toe with alpha-beta pruning
function minimaxSuper(
  superState: SuperBoard, 
  depth: number, 
  isMaximizing: boolean, 
  player: Player,
  alpha: number,
  beta: number
): number {
  const opponent = player === Player.X ? Player.O : Player.X;
  const currentPlayer = isMaximizing ? player : opponent;
  
  // Terminal states
  const winner = checkSuperWinner(superState);
  if (winner === player) return 100;
  if (winner === opponent) return -100;
  if (checkSuperDraw(superState)) return 0;
  if (depth === 0) return evaluateSuperBoard(superState, player);
  
  const validMoves = getValidSuperMoves(superState);
  
  if (validMoves.length === 0) {
    return evaluateSuperBoard(superState, player);
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    
    for (const move of validMoves) {
      const newState = makeValidMove(
        superState, 
        move.boardIndex, 
        move.cellIndex, 
        currentPlayer
      );
      
      const score = minimaxSuper(
        newState, 
        depth - 1, 
        false, 
        player, 
        alpha, 
        beta
      );
      
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return maxScore;
  } else {
    let minScore = Infinity;
    
    for (const move of validMoves) {
      const newState = makeValidMove(
        superState, 
        move.boardIndex, 
        move.cellIndex, 
        currentPlayer
      );
      
      const score = minimaxSuper(
        newState, 
        depth - 1, 
        true, 
        player, 
        alpha, 
        beta
      );
      
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return minScore;
  }
}