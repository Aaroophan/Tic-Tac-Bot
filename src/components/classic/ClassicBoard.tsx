import React from 'react';
import { GameCell, Player } from '../../types/game';

interface ClassicBoardProps {
  board: GameCell[];
  onCellClick: (index: number) => void;
  winningCells: number[];
  isDarkMode: boolean;
  smallBoard?: boolean;
  disabled?: boolean;
}

const ClassicBoard: React.FC<ClassicBoardProps> = ({ 
  board, 
  onCellClick, 
  winningCells, 
  isDarkMode,
  smallBoard = false,
  disabled = false
}) => {
  const renderCell = (index: number) => {
    const isWinningCell = winningCells.includes(index);
    const cellValue = board[index];
    
    return (
      <button
        key={index}
        className={`aspect-square ${
          smallBoard ? 'text-lg sm:text-xl' : 'text-3xl sm:text-5xl'
        } font-bold flex items-center justify-center ${
          isWinningCell 
            ? 'bg-green-200 dark:bg-green-800' 
            : 'bg-white dark:bg-slate-800'
        } ${
          !disabled && cellValue === Player.NONE 
            ? 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer' 
            : 'cursor-default'
        } transition-colors duration-200 border border-slate-300 dark:border-slate-600`}
        onClick={() => !disabled && onCellClick(index)}
        disabled={disabled || cellValue !== Player.NONE}
        aria-label={`Cell ${index + 1}, ${cellValue || 'empty'}`}
      >
        {cellValue === Player.X && (
          <span className={`${isWinningCell ? 'text-green-700 dark:text-green-300' : 'text-blue-500 dark:text-blue-400'}`}>
            X
          </span>
        )}
        {cellValue === Player.O && (
          <span className={`${isWinningCell ? 'text-green-700 dark:text-green-300' : 'text-rose-500 dark:text-rose-400'}`}>
            O
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`grid grid-cols-3 gap-1 ${smallBoard ? 'w-full' : 'w-full max-w-[350px] m-4'}`}>
      {Array(9).fill(null).map((_, index) => renderCell(index))}
    </div>
  );
};

export default ClassicBoard;