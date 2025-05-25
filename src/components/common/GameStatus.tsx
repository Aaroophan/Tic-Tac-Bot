import React from 'react';
import { Player } from '../../types/game';
import { Loader2 } from 'lucide-react';

interface GameStatusProps {
  turn: Player.X | Player.O;
  winner: Player | null;
  isDraw: boolean;
  isAIThinking: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ turn, winner, isDraw, isAIThinking }) => {
  const renderStatus = () => {
    if (winner) {
      return (
        <div className={`font-bold text-xl ${
          winner === Player.X ? 'text-blue-500' : 'text-rose-500'
        }`}>
          Player {winner} Wins!
        </div>
      );
    }

    if (isDraw) {
      return <div className="font-bold text-xl text-slate-500">Game Ended in a Draw</div>;
    }

    return (
      <div className="flex items-center gap-2">
        <span>Current Turn: </span>
        <span className={`font-bold ${
          turn === Player.X ? 'text-blue-500' : 'text-rose-500'
        }`}>
          Player {turn}
        </span>
        {isAIThinking && (
          <span className="flex items-center gap-1 text-slate-500">
            <Loader2 className="animate-spin" size={16} />
            <span>Thinking...</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="py-4 px-6 mb-4 bg-white dark:bg-slate-800 rounded-lg shadow-md w-full max-w-md text-center">
      {renderStatus()}
    </div>
  );
};

export default GameStatus;