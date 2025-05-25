import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import ClassicBoard from './ClassicBoard';
import AIControls from '../common/AIControls';
import GameStatus from '../common/GameStatus';
import DecisionTreeView from '../ai/DecisionTreeView';
import { GameMode, Player, GameCell, AISettings, MoveHistoryItem } from '../../types/game';
import { checkWinner, checkDraw, isApproachingDraw, removeEarliestMove } from '../../game/classicGame';
import { getAIMove, getDecisionTree } from '../../game/ai/minimaxClassic';

interface ClassicGameProps {
  gameMode: GameMode;
  onBack: () => void;
  isDarkMode: boolean;
}

const ClassicGame: React.FC<ClassicGameProps> = ({ gameMode, onBack, isDarkMode }) => {
  const [board, setBoard] = useState<GameCell[]>(Array(9).fill(Player.NONE));
  const [turn, setTurn] = useState<Player.X | Player.O>(Player.X);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
  const [totalMoves, setTotalMoves] = useState(0);
  const [aiSettings, setAISettings] = useState<AISettings>({
    level: 'hard',
    showDecisionTree: false
  });
  const [decisionTree, setDecisionTree] = useState<any>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Reset game
  const resetGame = () => {
    // First, clear any ongoing AI thinking state
    setIsAIThinking(false);
    setDecisionTree(null);
    
    // Then reset all game state
    setBoard(Array(9).fill(Player.NONE));
    setTurn(Player.X);
    setWinner(null);
    setIsDraw(false);
    setMoveHistory([]);
    setTotalMoves(0);
  };

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (winner || board[index] !== Player.NONE || 
        (gameMode !== GameMode.PLAYER_VS_PLAYER && turn === Player.O)) {
      return;
    }

    makeMove(index);
  };

  // Make a move
  const makeMove = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = turn;
    
    // Increment total moves
    const nextMoveNumber = totalMoves + 1;
    setTotalMoves(nextMoveNumber);
    
    // Record move in history
    const newMoveHistory = [...moveHistory, {
      position: index,
      player: turn,
      timestamp: Date.now(),
      moveNumber: nextMoveNumber
    }];
    
    // Update board state
    setBoard(newBoard);
    setMoveHistory(newMoveHistory);

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (isApproachingDraw(newBoard)) {
      // Remove earliest move if approaching draw
      const { newBoard: continuousBoard, newHistory } = removeEarliestMove(newBoard, newMoveHistory);
      setBoard(continuousBoard);
      setMoveHistory(newHistory);
      // Continue game with next player
      setTurn(turn === Player.X ? Player.O : Player.X);
    } else {
      // Switch turns
      setTurn(turn === Player.X ? Player.O : Player.X);
    }
  };

  // AI move logic
  useEffect(() => {
    let isActive = true; // Flag to track if the effect is still active

    const makeAIMove = async () => {
      if (
        (gameMode === GameMode.PLAYER_VS_AI && turn === Player.O) || 
        (gameMode === GameMode.AI_VS_AI && !winner)
      ) {
        setIsAIThinking(true);
        
        // Show decision tree if enabled
        if (aiSettings.showDecisionTree) {
          const tree = getDecisionTree(board, turn, getDifficultyDepth());
          if (isActive) { // Only update if effect is still active
            setDecisionTree(tree);
          }
        }

        // Add a small delay to make the AI move visible
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Only proceed if the effect is still active
        if (!isActive) return;
        
        const aiMoveIndex = getAIMove(board, turn, getDifficultyDepth());
        
        if (aiMoveIndex !== null && board[aiMoveIndex] === Player.NONE) {
          makeMove(aiMoveIndex);
        }
        
        if (isActive) { // Only update if effect is still active
          setIsAIThinking(false);
        }
      }
    };

    if (!winner) {
      makeAIMove();
    }

    // Cleanup function
    return () => {
      isActive = false;
      setIsAIThinking(false);
    };
  }, [turn, gameMode, winner, board]);

  // Get difficulty depth based on AI level
  const getDifficultyDepth = (): number => {
    switch (aiSettings.level) {
      case 'easy': return 1;
      case 'medium': return 3;
      case 'hard': return 9;
      default: return 9;
    }
  };

  // Update AI settings
  const handleAISettingsChange = (settings: AISettings) => {
    setAISettings(settings);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        
        <h2 className="text-xl font-bold">Infinite Tic Tac Toe</h2>
        
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <RotateCcw size={18} />
          <span>Restart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center">
          <GameStatus 
            turn={turn} 
            winner={winner} 
            isDraw={isDraw} 
            isAIThinking={isAIThinking} 
          />
          
          <ClassicBoard 
            board={board} 
            onCellClick={handleCellClick} 
            winningCells={winner ? getWinningCells(board) : []}
            isDarkMode={isDarkMode}
          />
          
          {(gameMode === GameMode.PLAYER_VS_AI || gameMode === GameMode.AI_VS_AI) && (
            <AIControls 
              settings={aiSettings} 
              onChange={handleAISettingsChange} 
              gameType="classic"
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold mb-4">Move History</h3>
            
            <div className="mb-4">
              {moveHistory.map((move) => (
                <div 
                  key={move.timestamp}
                  className="px-3 py-2 mb-1 rounded bg-slate-100 dark:bg-slate-700"
                >
                  {move.moveNumber < 10 ? `#0${move.moveNumber}: ${move.player} @ ${move.position + 1}` : `#${move.moveNumber}: ${move.player} @ ${move.position + 1}`}
                </div>
              ))}
            </div>
            
            {aiSettings.showDecisionTree && decisionTree && (
              <div>
                <h3 className="text-lg font-semibold mb-2">AI Decision Tree</h3>
                <DecisionTreeView tree={decisionTree} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get the winning cells
const getWinningCells = (board: GameCell[]): number[] => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }

  return [];
};

export default ClassicGame;