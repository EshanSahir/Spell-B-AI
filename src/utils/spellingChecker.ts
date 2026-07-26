export interface LetterFeedback {
  char: string;
  expectedChar?: string;
  status: 'correct' | 'wrong' | 'missing' | 'extra';
}

export interface DetailedSpellingFeedback {
  isCorrect: boolean;
  matchPercentage: number;
  letters: LetterFeedback[];
  cleanTarget: string;
  cleanAttempt: string;
  summaryNote: string;
}

export function compareSpelling(target: string, attempt: string): DetailedSpellingFeedback {
  const cleanTarget = target.trim().toLowerCase();
  const cleanAttempt = attempt.trim().toLowerCase();

  const isCorrect = cleanTarget === cleanAttempt;

  if (isCorrect) {
    return {
      isCorrect: true,
      matchPercentage: 100,
      letters: cleanTarget.split('').map(c => ({ char: c, status: 'correct' })),
      cleanTarget,
      cleanAttempt,
      summaryNote: 'Spot on! Perfect spelling!',
    };
  }

  // Calculate detailed letter comparison using Levenshtein alignment
  const letters: LetterFeedback[] = [];
  const targetChars = cleanTarget.split('');
  const attemptChars = cleanAttempt.split('');

  const maxLength = Math.max(targetChars.length, attemptChars.length);
  let correctCount = 0;

  for (let i = 0; i < maxLength; i++) {
    const t = targetChars[i];
    const a = attemptChars[i];

    if (t === undefined && a !== undefined) {
      letters.push({ char: a, status: 'extra' });
    } else if (a === undefined && t !== undefined) {
      letters.push({ char: '_', expectedChar: t, status: 'missing' });
    } else if (t === a) {
      correctCount++;
      letters.push({ char: a, status: 'correct' });
    } else {
      letters.push({ char: a, expectedChar: t, status: 'wrong' });
    }
  }

  const matchPercentage = Math.round((correctCount / targetChars.length) * 100);

  let summaryNote = '';
  if (matchPercentage >= 80) {
    summaryNote = 'So close! Just a minor typo or silent letter swap.';
  } else if (matchPercentage >= 50) {
    summaryNote = 'Good attempt! Review the root language spelling patterns.';
  } else {
    summaryNote = 'Keep practice going! Listen closely to the syllable hints.';
  }

  return {
    isCorrect: false,
    matchPercentage,
    letters,
    cleanTarget,
    cleanAttempt,
    summaryNote,
  };
}

export function formatDifficultyName(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return 'Beginner (Foundations)';
    case 'intermediate': return 'Intermediate (Regional)';
    case 'advanced': return 'Advanced (State)';
    case 'championship': return 'Championship (Scripps)';
    default: return difficulty;
  }
}

export function getDifficultyBadgeColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'championship': return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}
