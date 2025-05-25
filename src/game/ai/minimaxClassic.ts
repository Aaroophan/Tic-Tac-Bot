import { GameCell, Player } from '../../types/game';
import { 
  checkWinner, 
  checkDraw, 
  getAvailableMoves, 
  makeMove, 
  evaluateBoard 
} from '../classicGame';

// Main function to get the AI move
export function getAIMove(board: GameCell[], player: Player, depth: number): number | null {
  // If the board is empty, pick a random position
  if (board.every(cell => cell === Player.NONE)) {
    return Math.floor(Math.random() * 9);
  }
  
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) {
    return null;
  }
  
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];
  
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, player);
    const score = minimax(newBoard, depth, false, player, -Infinity, Infinity);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Minimax algorithm with alpha-beta pruning
function minimax(
  board: GameCell[], 
  depth: number, 
  isMaximizing: boolean, 
  player: Player,
  alpha: number,
  beta: number
): number {
  const opponent = player === Player.X ? Player.O : Player.X;
  const currentPlayer = isMaximizing ? player : opponent;
  
  // Terminal states
  const winner = checkWinner(board);
  if (winner === player) return 10;
  if (winner === opponent) return -10;
  if (checkDraw(board)) return 0;
  if (depth === 0) return evaluateBoard(board, player);
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    const moves = getAvailableMoves(board);
    
    for (const move of moves) {
      const newBoard = makeMove(board, move, currentPlayer);
      const score = minimax(newBoard, depth - 1, false, player, alpha, beta);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return maxScore;
  } else {
    let minScore = Infinity;
    const moves = getAvailableMoves(board);
    
    for (const move of moves) {
      const newBoard = makeMove(board, move, currentPlayer);
      const score = minimax(newBoard, depth - 1, true, player, alpha, beta);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return minScore;
  }
}

// Generate a simplified decision tree for visualization
export function getDecisionTree(board: GameCell[], player: Player, depth: number): any {
  const opponent = player === Player.X ? Player.O : Player.X;
  
  // Create tree node
  const node: any = {
    board: [...board],
    score: evaluateBoard(board, player),
    children: []
  };
  
  // Terminal states or max depth reached
  const winner = checkWinner(board);
  if (winner || checkDraw(board) || depth === 0) {
    if (winner === player) node.score = 10;
    else if (winner === opponent) node.score = -10;
    else if (checkDraw(board)) node.score = 0;
    return node;
  }
  
  // Get available moves
  const availableMoves = getAvailableMoves(board);
  
  // Generate children nodes
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, player);
    const childNode = getDecisionTree(newBoard, opponent, depth - 1);
    childNode.move = move;
    node.children.push(childNode);
  }
  
  // Sort children by score (for maximizing player, higher is better)
  node.children.sort((a: any, b: any) => b.score - a.score);
  
  // Limit number of children for visualization
  if (node.children.length > 10) {
    node.children = node.children.slice(0, 10);
  }
  
  return node;
}