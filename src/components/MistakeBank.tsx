import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, Volume2, ArrowRight, Trash2 } from 'lucide-react';
import { MistakeEntry, SpellingWord, WordList } from '../types';
import { pronouncer } from '../utils/audio';

interface MistakeBankProps {
  mistakes: MistakeEntry[];
  onStartPracticeList: (list: WordList) => void;
  onClearMistakes: () => void;
}

export const MistakeBank: React.FC<MistakeBankProps> = ({
  mistakes,
  onStartPracticeList,
  onClearMistakes,
}) => {
  const handleStartMistakeDrill = () => {
    if (mistakes.length === 0) return;

    const mistakeList: WordList = {
      id: `mistakes-${Date.now()}`,
      title: 'Targeted Mistake Bank Drill',
      description: 'Practice session focusing purely on previously misspelled words.',
      difficulty: 'intermediate',
      category: 'Mistake Review',
      isCustom: true,
      words: mistakes.map(m => m.word),
    };

    onStartPracticeList(mistakeList);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-amber-100">
              Mistake Bank & Error Review
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Re-test your weak words to build long-term spelling memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mistakes.length > 0 && (
            <>
              <button
                onClick={onClearMistakes}
                className="px-3.5 py-2 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>

              <button
                onClick={handleStartMistakeDrill}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                Start Mistake Drill ({mistakes.length})
              </button>
            </>
          )}
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-slate-800 shadow-xs space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-amber-100">
            No Misspelled Words Saved!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Great job! Your mistake bank is clean. Any word you misspell during dictation will automatically show up here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((entry) => (
            <div
              key={entry.word.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-amber-600 dark:text-amber-400 capitalize">
                    {entry.word.word}
                  </span>
                  <button
                    onClick={() => pronouncer.speakWord(entry.word.word)}
                    className="p-1 hover:bg-amber-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4 text-amber-600" />
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono">
                    {entry.word.phonetic}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                  "{entry.word.definition}"
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Language: <strong className="text-slate-700 dark:text-slate-300">{entry.word.origin}</strong></span>
                  <span>•</span>
                  <span>Your last attempt: <strong className="text-rose-600 line-through">{entry.userAttempt}</strong></span>
                </div>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0">
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold border border-rose-200/60">
                  Missed {entry.timesWrong} {entry.timesWrong === 1 ? 'time' : 'times'}
                </span>
                <button
                  onClick={() => {
                    const singleWordList: WordList = {
                      id: `single-${entry.word.id}`,
                      title: `Retry: ${entry.word.word}`,
                      description: 'Single word retry drill.',
                      difficulty: entry.word.difficulty,
                      category: 'Single Word Review',
                      words: [entry.word],
                    };
                    onStartPracticeList(singleWordList);
                  }}
                  className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  Retry Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
