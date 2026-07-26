export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'championship';

export interface SpellingWord {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  partOfSpeech: string;
  origin: string;
  sampleSentence: string;
  syllables?: string;
  difficulty: DifficultyLevel;
  mnemonic?: string;
}

export interface WordList {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  category: string;
  words: SpellingWord[];
  isCustom?: boolean;
}

export interface PracticeResult {
  id: string;
  wordId: string;
  word: string;
  userAttempt: string;
  isCorrect: boolean;
  timestamp: number;
  timeSpentSeconds: number;
  difficulty: DifficultyLevel;
  hintsUsed: number;
  aiExplanation?: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  wordsAttempted: number;
  wordsCorrect: number;
  totalTimeSeconds: number;
  byDifficulty: Record<DifficultyLevel, { attempted: number; correct: number }>;
}

export interface MistakeEntry {
  word: SpellingWord;
  userAttempt: string;
  timestamp: number;
  timesWrong: number;
}

export interface AppStats {
  totalAttempted: number;
  totalCorrect: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  masteredWords: string[]; // word IDs
  dailyHistory: DailyProgress[];
  mistakeBank: MistakeEntry[];
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
