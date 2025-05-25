import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ClassicBoard from './classic/ClassicBoard';
import { Player } from '../types/game';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "Classic Tic Tac Toe",
      content: (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="mb-4">
              In Classic Tic Tac Toe, players take turns placing their mark (X or O) on a 3×3 grid.
            </p>
            <p className="mb-4">
              The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins the game.
            </p>
            <p>
              If all nine squares are filled and no player has three marks in a row, the game ends in a draw.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <ClassicBoard 
              board={[Player.X, Player.NONE, Player.O, Player.NONE, Player.X, Player.NONE, Player.NONE, Player.NONE, Player.O]}
              onCellClick={() => {}}
              winningCells={[]}
              isDarkMode={false}
            />
          </div>
        </div>
      )
    },
    {
      title: "Super Tic Tac Toe",
      content: (
        <div>
          <p className="mb-4">
            Super Tic Tac Toe is played on a 3×3 grid of 3×3 Tic Tac Toe boards, creating a 9×9 grid overall.
          </p>
          <p className="mb-4">
            To win, you must win three small boards in a row (horizontally, vertically, or diagonally).
          </p>
          <p className="mb-4 font-semibold">
            The key strategic element: Your move dictates your opponent's next board!
          </p>
          <p className="mb-4">
            When you place your mark in one of the small boards, the corresponding position in that small board determines which of the 9 main boards your opponent must play in next.
          </p>
          <p>
            For example, if you place your mark in the top-right cell of any small board, your opponent must play in the top-right board on their next turn.
          </p>
        </div>
      )
    },
    {
      title: "Super Tic Tac Toe Strategy",
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Strategic Tips:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Think ahead:</strong> Consider which board you'll send your opponent to with each move.
            </li>
            <li>
              <strong>Control the center:</strong> The center board is strategically valuable.
            </li>
            <li>
              <strong>Force opponents to completed boards:</strong> If a board is already won or drawn, and you send your opponent there, they can play in any board!
            </li>
            <li>
              <strong>Watch for winning patterns:</strong> Just like regular Tic Tac Toe, look for opportunities to create two-in-a-row with an open third position.
            </li>
            <li>
              <strong>Block opponent's progress:</strong> Pay attention to boards where your opponent is close to winning.
            </li>
          </ol>
        </div>
      )
    },
    {
      title: "AI Opponents",
      content: (
        <div>
          <p className="mb-4">
            The game offers AI opponents of varying difficulty:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              <strong>Easy:</strong> Makes decisions with minimal lookahead, focusing only on immediate opportunities.
            </li>
            <li>
              <strong>Medium:</strong> Balances speed and intelligence, looking a few moves ahead.
            </li>
            <li>
              <strong>Hard:</strong> Uses advanced Minimax algorithm with Alpha-Beta pruning to look many moves ahead.
            </li>
          </ul>
          <p className="mb-4">
            In Classic Tic Tac Toe, the Hard AI is unbeatable - it will always win or force a draw!
          </p>
          <p>
            For Super Tic Tac Toe, you can toggle on "Show AI Decision Tree" to visualize how the AI evaluates possible moves and makes decisions.
          </p>
        </div>
      )
    }
  ];

  const handlePrev = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNext = () => {
    setCurrentPage(Math.min(pages.length - 1, currentPage + 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{pages[currentPage].title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close tutorial"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(80vh-120px)]">
          {pages[currentPage].content}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentPage === 0 
                ? 'text-slate-400 cursor-not-allowed' 
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>
          
          <div className="text-sm text-slate-500">
            {currentPage + 1} of {pages.length}
          </div>
          
          <button 
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentPage === pages.length - 1 
                ? 'text-slate-400 cursor-not-allowed' 
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;