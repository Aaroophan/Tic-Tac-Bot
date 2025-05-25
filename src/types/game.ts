export enum GameType {
  CLASSIC = 'classic',
  SUPER = 'super'
}

export enum GameMode {
  PLAYER_VS_PLAYER = 'player-vs-player',
  PLAYER_VS_AI = 'player-vs-ai',
  AI_VS_AI = 'ai-vs-ai'
}

export enum Player {
  X = 'X',
  O = 'O',
  NONE = ''
}

export type GameCell = Player.X | Player.O | Player.NONE;

export type ClassicBoard = GameCell[];

export interface SuperBoard {
  boards: ClassicBoard[];
  mainBoard: ClassicBoard;
  activeBoard: number | null;
  lastMove: { board: number; cell: number } | null;
}

export interface GameState {
  turn: Player.X | Player.O;
  winner: Player | null;
  isDraw: boolean;
  moveHistory: number[];
}

export type AILevel = 'easy' | 'medium' | 'hard';

export interface AISettings {
  level: AILevel;
  showDecisionTree: boolean;
}

export interface MoveHistoryItem {
  position: number;
  player: Player;
  timestamp: number;
}