export interface UserProfile {
  id: string;
  username: string;
  xp: number;
  stars: number;
  level: number;
  createdAt: number;
}

export interface GameProject {
  id: string;
  name: string;
  code: string;
  createdAt: number;
  type: 'dream' | 'block';
  userId: string;
}

export interface TypingResult {
  id: string;
  userId: string;
  language: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

export interface LogEntry {
  id: string;
  action: string;
  timestamp: number;
  details: string;
}

export enum GameMode {
  MENU = 'MENU',
  DREAM_GENERATOR = 'DREAM_GENERATOR',
  ASTRO_NAV = 'ASTRO_NAV',
  VELOCITY_TYPING = 'VELOCITY_TYPING',
  SAVED_GAMES = 'SAVED_GAMES',
}

export interface NavCommand {
  id: string;
  type: 'FORWARD' | 'LEFT' | 'RIGHT' | 'JUMP';
  label: string;
}

export interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}