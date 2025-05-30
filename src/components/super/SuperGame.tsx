import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import SuperBoard from './SuperBoard';
import AIControls from '../common/AIControls';
import GameStatus from '../common/GameStatus';
import DecisionTreeView from '../ai/DecisionTreeView';
import { GameMode, Player, AISettings, MoveHistoryItem } from '../../types/game';
import { initSuperBoard, checkSuperWinner, checkSuperDraw, makeValidMove } from '../../game/superGame';
import { getSuperAIMove } from '../../game/ai/minimaxSuper';

interface SuperGameProps {
  gameMode: GameMode;
  onBack: () => void;
  isDarkMode: boolean;
}

const SuperGame: React.FC<SuperGameProps> = ({ gameMode, onBack, isDarkMode }) => {
  const [superState, setSuperState] = useState(initSuperBoard());
  const [turn, setTurn] = useState<Player.X | Player.O>(Player.X);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
  const [totalMoves, setTotalMoves] = useState(0);
  const [aiSettings, setAISettings] = useState<AISettings>({
    level: 'hard',
    showDecisionTree: false
  });
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Reset game
  const resetGame = () => {
    setSuperState(initSuperBoard());
    setTurn(Player.X);
    setWinner(null);
    setIsDraw(false);
    setMoveHistory([]);
    setTotalMoves(0);
  };

  // Handle cell click
  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (winner || isDraw || 
        (gameMode !== GameMode.PLAYER_VS_PLAYER && turn === Player.O) ||
        (superState.activeBoard !== null && superState.activeBoard !== boardIndex) ||
        superState.boards[boardIndex][cellIndex] !== Player.NONE) {
      return;
    }

    makeMove(boardIndex, cellIndex);
  };

  // Make a move
  const makeMove = (boardIndex: number, cellIndex: number) => {
    const newState = makeValidMove(superState, boardIndex, cellIndex, turn);
    
    // Increment total moves
    const nextMoveNumber = totalMoves + 1;
    setTotalMoves(nextMoveNumber);
    
    // Record move in history
    const newMove = {
      position: boardIndex * 9 + cellIndex, // Convert to single index for consistency
      player: turn,
      timestamp: Date.now(),
      moveNumber: nextMoveNumber
    };
    
    setMoveHistory(prev => [...prev, newMove]);
    
    // Update board state
    setSuperState(newState);
    
    // Check for winner or draw
    const gameWinner = checkSuperWinner(newState);
    const gameDraw = checkSuperDraw(newState);
    
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (gameDraw) {
      setIsDraw(true);
    } else {
      // Switch turns
      setTurn(turn === Player.X ? Player.O : Player.X);
    }
  };

  // AI move logic
  useEffect(() => {
    const makeAIMove = async () => {
      if (
        (gameMode === GameMode.PLAYER_VS_AI && turn === Player.O) || 
        (gameMode === GameMode.AI_VS_AI && !winner && !isDraw)
      ) {
        setIsAIThinking(true);
        
        // Add a delay to make the AI move visible
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { boardIndex, cellIndex } = getSuperAIMove(superState, turn, getDifficultyDepth());
        
        if (boardIndex !== null && cellIndex !== null) {
          makeMove(boardIndex, cellIndex);
        }
        
        setIsAIThinking(false);
      }
    };

    if (!winner && !isDraw) {
      makeAIMove();
    }
  }, [turn, gameMode, winner, isDraw, superState]);

  // Get difficulty depth based on AI level
  const getDifficultyDepth = (): number => {
    switch (aiSettings.level) {
      case 'easy': return 1;
      case 'medium': return 4;
      case 'hard': return 7; // Super TTT is more complex, so we limit the depth
      default: return 3;
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
        </button>
        
        <h2 className="text-xl font-bold">Super Tic Tac Toe</h2>
        
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <RotateCcw size={18} />
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
          
          <div className="my-6">
            <SuperBoard 
              superState={superState}
              onCellClick={handleCellClick}
              turn={turn}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {(gameMode === GameMode.PLAYER_VS_AI || gameMode === GameMode.AI_VS_AI) && (
            <AIControls 
              settings={aiSettings} 
              onChange={handleAISettingsChange} 
              gameType="super"
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold mb-4">Move History</h3>
            
            <div className="mb-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {moveHistory.map((move) => {
                const boardIndex = Math.floor(move.position / 9);
                const cellIndex = move.position % 9;
                return (
                  <div 
                    key={move.timestamp}
                    className="px-3 py-2 mb-1 rounded bg-slate-700 dark:bg-slate-700 text-sm"
                  >
                    {move.moveNumber < 10 ? `#0${move.moveNumber}: ${move.player} @ Board ${boardIndex + 1}, Cell ${cellIndex + 1}` : 
                     `#${move.moveNumber}: ${move.player} @ Board ${boardIndex + 1}, Cell ${cellIndex + 1}`}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperGame;