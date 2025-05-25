import React from 'react';
import { AISettings, GameType } from '../../types/game';
import { Brain } from 'lucide-react';

interface AIControlsProps {
  settings: AISettings;
  onChange: (settings: AISettings) => void;
  gameType: string;
}

const AIControls: React.FC<AIControlsProps> = ({ settings, onChange, gameType }) => {
  const handleLevelChange = (level: AISettings['level']) => {
    onChange({ ...settings, level });
  };

  const handleToggleDecisionTree = () => {
    onChange({ ...settings, showDecisionTree: !settings.showDecisionTree });
  };

  return (
    <div className="w-full max-w-md mt-6 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Brain size={20} />
        <span>AI Settings</span>
      </h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Difficulty Level</label>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level as AISettings['level'])}
              className={`px-4 py-2 rounded-lg capitalize ${
                settings.level === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      
      {gameType === 'classic' && (
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={settings.showDecisionTree}
                onChange={handleToggleDecisionTree}
              />
              <div className={`block w-14 h-8 rounded-full ${
                settings.showDecisionTree ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                settings.showDecisionTree ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
            <div className="ml-3 text-sm">Show AI Decision Tree</div>
          </label>
        </div>
      )}
    </div>
  );
};

export default AIControls;