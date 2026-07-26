import { AppStats, WordList, PracticeResult, SpellingWord, MistakeEntry } from '../types';
import { CURATED_WORD_LISTS } from '../data/curatedWordLists';

const STATS_KEY = 'spelling_bee_app_stats_v1';
const CUSTOM_LISTS_KEY = 'spelling_bee_custom_lists_v1';

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function loadAppStats(): AppStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const stats: AppStats = JSON.parse(raw);
      // Check and update streak
      const today = getTodayDateString();
      if (stats.lastActiveDate && stats.lastActiveDate !== today) {
        const last = new Date(stats.lastActiveDate);
        const current = new Date(today);
        const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) {
          stats.streakDays = 0; // Streak broken
        }
      }
      return stats;
    }
  } catch (e) {
    console.error('Error loading stats from localStorage', e);
  }

  // Initial stats default
  return {
    totalAttempted: 0,
    totalCorrect: 0,
    streakDays: 1,
    lastActiveDate: getTodayDateString(),
    masteredWords: [],
    dailyHistory: [],
    mistakeBank: [],
  };
}

export function saveAppStats(stats: AppStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats to localStorage', e);
  }
}

export function recordPracticeResult(result: PracticeResult, word: SpellingWord): AppStats {
  const stats = loadAppStats();
  const today = getTodayDateString();

  // 1. Update overall totals
  stats.totalAttempted += 1;
  if (result.isCorrect) {
    stats.totalCorrect += 1;
    if (!stats.masteredWords.includes(word.id)) {
      stats.masteredWords.push(word.id);
    }
  }

  // 2. Update Streak
  if (stats.lastActiveDate !== today) {
    const last = new Date(stats.lastActiveDate);
    const current = new Date(today);
    const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      stats.streakDays += 1;
    } else if (diffDays > 1) {
      stats.streakDays = 1;
    }
    stats.lastActiveDate = today;
  }

  // 3. Update Daily History
  let todayEntry = stats.dailyHistory.find(d => d.date === today);
  if (!todayEntry) {
    todayEntry = {
      date: today,
      wordsAttempted: 0,
      wordsCorrect: 0,
      totalTimeSeconds: 0,
      byDifficulty: {
        beginner: { attempted: 0, correct: 0 },
        intermediate: { attempted: 0, correct: 0 },
        advanced: { attempted: 0, correct: 0 },
        championship: { attempted: 0, correct: 0 },
      },
    };
    stats.dailyHistory.push(todayEntry);
  }

  todayEntry.wordsAttempted += 1;
  if (result.isCorrect) todayEntry.wordsCorrect += 1;
  todayEntry.totalTimeSeconds += result.timeSpentSeconds;

  const diffKey = result.difficulty;
  if (todayEntry.byDifficulty[diffKey]) {
    todayEntry.byDifficulty[diffKey].attempted += 1;
    if (result.isCorrect) todayEntry.byDifficulty[diffKey].correct += 1;
  }

  // Keep max 30 days history
  if (stats.dailyHistory.length > 30) {
    stats.dailyHistory = stats.dailyHistory.slice(stats.dailyHistory.length - 30);
  }

  // 4. Update Mistake Bank
  if (!result.isCorrect) {
    const existingMistake = stats.mistakeBank.find(m => m.word.id === word.id || m.word.word === word.word);
    if (existingMistake) {
      existingMistake.timesWrong += 1;
      existingMistake.userAttempt = result.userAttempt;
      existingMistake.timestamp = Date.now();
    } else {
      stats.mistakeBank.push({
        word,
        userAttempt: result.userAttempt,
        timestamp: Date.now(),
        timesWrong: 1,
      });
    }
  } else {
    // If answered correctly, reduce mistake count or remove if mastered
    const existingIdx = stats.mistakeBank.findIndex(m => m.word.id === word.id || m.word.word === word.word);
    if (existingIdx !== -1) {
      stats.mistakeBank[existingIdx].timesWrong -= 1;
      if (stats.mistakeBank[existingIdx].timesWrong <= 0) {
        stats.mistakeBank.splice(existingIdx, 1);
      }
    }
  }

  saveAppStats(stats);
  return stats;
}

export function loadCustomWordLists(): WordList[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LISTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading custom lists', e);
  }
  return [];
}

export function saveCustomWordList(newList: WordList): WordList[] {
  const customLists = loadCustomWordLists();
  const existingIdx = customLists.findIndex(l => l.id === newList.id);
  if (existingIdx !== -1) {
    customLists[existingIdx] = newList;
  } else {
    customLists.unshift(newList);
  }
  try {
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(customLists));
  } catch (e) {
    console.error('Error saving custom list', e);
  }
  return customLists;
}

export function getAllWordLists(): WordList[] {
  const custom = loadCustomWordLists();
  return [...custom, ...CURATED_WORD_LISTS];
}
