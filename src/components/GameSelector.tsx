import React, { useState } from 'react';
import { GameMode, GameType } from '../types/game';
import { Users, Bot, Cpu } from 'lucide-react';

interface GameOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const GameOption: React.FC<GameOptionProps> = ({ icon, title, description, selected, onClick }) => (
  <div 
    className={`p-6 rounded-lg cursor-pointer transition-all ${
      selected 
        ? 'bg-blue-500 text-white scale-105 shadow-lg' 
        : 'bg-slate-400 dark:bg-slate-800 hover:bg-blue-700 dark:hover:bg-gray-900 shadow'
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  </div>
);

interface GameSelectorProps {
  onSelect: (gameType: GameType, gameMode: GameMode) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelect }) => {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleGameSelect = (game: GameType) => {
    setSelectedGame(game);
    setSelectedMode(null);
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    if (selectedGame) {
      onSelect(selectedGame, mode);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Game</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <GameOption
          icon={<div className="grid grid-cols-3 gap-1 w-16 h-16">
            {Array(9).fill(null).map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-600 rounded" />
            ))}
          </div>}
          title="Classic Tic Tac Toe"
          description="3x3 grid, get 3 in a row to win"
          selected={selectedGame === GameType.CLASSIC}
          onClick={() => handleGameSelect(GameType.CLASSIC)}
        />
        
        <GameOption
          icon={<div className="grid grid-cols-3 gap-1 w-16 h-16">
            {Array(9).fill(null).map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-[2px] bg-slate-200 dark:bg-slate-600 rounded p-[2px]">
                {Array(9).fill(null).map((_, j) => (
                  <div key={j} className="bg-slate-200 dark:bg-slate-500 rounded-sm" />
                ))}
              </div>
            ))}
          </div>}
          title="Super Tic Tac Toe"
          description="Strategic nested boards with advanced gameplay"
          selected={selectedGame === GameType.SUPER}
          onClick={() => handleGameSelect(GameType.SUPER)}
        />
      </div>
      
      {selectedGame && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Choose Play Mode</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GameOption
              icon={<Users size={40} />}
              title="Player vs Player"
              description="Play against a friend locally"
              selected={selectedMode === GameMode.PLAYER_VS_PLAYER}
              onClick={() => handleModeSelect(GameMode.PLAYER_VS_PLAYER)}
            />
            
            <GameOption
              icon={<Bot size={40} />}
              title="Player vs AI"
              description="Challenge the computer with adjustable difficulty"
              selected={selectedMode === GameMode.PLAYER_VS_AI}
              onClick={() => handleModeSelect(GameMode.PLAYER_VS_AI)}
            />
            
            <GameOption
              icon={<Cpu size={40} />}
              title="AI vs AI"
              description="Watch AI battle with decision visualization"
              selected={selectedMode === GameMode.AI_VS_AI}
              onClick={() => handleModeSelect(GameMode.AI_VS_AI)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GameSelector;