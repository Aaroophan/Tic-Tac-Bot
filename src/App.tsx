import React, { useState } from 'react';
import { Sun, Moon, Info, Store, Instagram, Linkedin, Github } from 'lucide-react';
import GameSelector from './components/GameSelector';
import ClassicGame from './components/classic/ClassicGame';
import SuperGame from './components/super/SuperGame';
import Tutorial from './components/Tutorial';
import { GameMode, GameType } from './types/game';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PLAYER_VS_PLAYER);
  const [showTutorial, setShowTutorial] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleGameSelect = (type: GameType, mode: GameMode) => {
    setGameType(type);
    setGameMode(mode);
  };

  const handleBackToMenu = () => {
    setGameType(null);
  };

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  return (
    <>
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-100 to-gray-100 text-slate-900'}`}>
      <header className="py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tic Tac Bot</h1>
        <div className="flex gap-4">
          <button 
            onClick={toggleTutorial}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Show Tutorial"
          >
            <Info size={20} />
          </button>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            disabled={true}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        {showTutorial && (
          <Tutorial onClose={toggleTutorial} />
        )}

        {!gameType && (
          <GameSelector onSelect={handleGameSelect} />
        )}

        {gameType === GameType.CLASSIC && (
          <ClassicGame 
            gameMode={gameMode}
            onBack={handleBackToMenu}
            isDarkMode={isDarkMode}
          />
        )}

        {gameType === GameType.SUPER && (
          <SuperGame 
            gameMode={gameMode}
            onBack={handleBackToMenu}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
    </div>
    
      <footer className="bg-gradient-to-br from-gray-900 to-black text-gray-400 py-6">
        <div className="container mx-auto px-4">
          <hr className="border-gray-700 mb-4" />
          <div className="text-center">
            <a
              href="http://aaroophan.onrender.com/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              &copy; 2025
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocKNRvtI3cvci9DHfzBfC3d0PgPneG86fZv7w5se1U5mfBgcNqXj4g=s83-c-mo"
                alt="Aaroophan"
                className="h-5 w-5 rounded-full"
              />
              Aaroophan
            </a>

            <ul className="flex justify-center gap-4 mt-4">
              <li>
                <a
                  href="http://aaroophan.onrender.com"
                  aria-label="Portfolio"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Store size={15} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/aaroophan/?theme=dark"
                  aria-label="Instagram"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Instagram size={15} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/aaroophan"
                  aria-label="LinkedIn"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Linkedin size={15} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Aaroophan"
                  aria-label="GitHub"
                  className="hover:text-white transition-colors duration-200"
                >
                  <Github size={15} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;