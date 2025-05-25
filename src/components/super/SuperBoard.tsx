import React from 'react';
import ClassicBoard from '../classic/ClassicBoard';
import { SuperBoard as SuperBoardType, GameCell, Player } from '../../types/game';
import { checkWinner } from '../../game/classicGame';

interface SuperBoardProps {
  superState: SuperBoardType;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  turn: Player.X | Player.O;
  isDarkMode: boolean;
}

const SuperBoard: React.FC<SuperBoardProps> = ({ 
  superState, 
  onCellClick, 
  turn,
  isDarkMode
}) => {
  const { boards, mainBoard, activeBoard } = superState;

  // Get winning cells for a specific board
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

  // Check if a board is complete (has a winner or is full)
  const isBoardComplete = (boardIndex: number): boolean => {
    return checkWinner(boards[boardIndex]) !== null || 
           boards[boardIndex].every(cell => cell !== Player.NONE);
  };

  // Render a sub-board
  const renderSubBoard = (boardIndex: number) => {
    const isActive = activeBoard === null || activeBoard === boardIndex;
    const isPlayable = isActive && !isBoardComplete(boardIndex);
    const boardWinner = checkWinner(boards[boardIndex]);
    const winningCells = boardWinner ? getWinningCells(boards[boardIndex]) : [];

    // Determine the border style based on if this board is where the next move must be played
    const borderStyle = isActive && activeBoard !== null
      ? `border-4 ${turn === Player.X ? 'border-blue-500' : 'border-rose-500'}`
      : 'border-4 border-slate-800 dark:border-slate-800';

    // Determine background color for completed boards
    const bgStyle = isBoardComplete(boardIndex) 
      ? boardWinner === Player.X 
        ? 'bg-blue-500/20 dark:bg-blue-500/30' 
        : boardWinner === Player.O 
          ? 'bg-rose-500/20 dark:bg-rose-500/30'
          : 'bg-slate-700 dark:bg-slate-700' // Draw
      : 'bg-white dark:bg-slate-800';

    // Check if this board is a win in the main board
    const isPartOfMainWin = getWinningCells(mainBoard).includes(boardIndex);
    const mainWinStyle = isPartOfMainWin 
      ? 'ring-4 ring-green-500 dark:ring-green-400' 
      : '';

    return (
      <div 
        key={boardIndex} 
        className={`p-1 ${borderStyle} ${bgStyle} ${mainWinStyle} rounded-lg`}
      >
        <ClassicBoard 
          board={boards[boardIndex]}
          onCellClick={(cellIndex) => onCellClick(boardIndex, cellIndex)}
          winningCells={winningCells}
          isDarkMode={isDarkMode}
          smallBoard={true}
          disabled={!isPlayable}
        />
        
        {/* Show winner symbol for completed boards */}
        {boardWinner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-5xl font-bold ${
              boardWinner === Player.X 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-rose-500 dark:text-rose-400'
            }`}>
              {boardWinner}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-5 w-full max-w-[800px]">
      {Array(9).fill(null).map((_, index) => (
        <div key={index} className="relative aspect-square">
          {renderSubBoard(index)}
        </div>
      ))}
    </div>
  );
};

export default SuperBoard;