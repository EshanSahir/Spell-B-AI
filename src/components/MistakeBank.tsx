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
      <div className="bg-white dark:bg-[#161c28] p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-[#ff9600]" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Mistake Bank & Error Review
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
            Re-test misspelled words to refine spelling intuition and accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mistakes.length > 0 && (
            <>
              <button
                onClick={onClearMistakes}
                className="px-4 py-3 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-[#ff4b4b] border-2 border-[#ffc1c4] dark:border-red-900 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>

              <button
                onClick={handleStartMistakeDrill}
                className="px-6 py-3 bg-[#58cc02] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Drill ({mistakes.length})
              </button>
            </>
          )}
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#161c28] rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <CheckCircle2 className="w-12 h-12 text-[#58cc02] mx-auto" />
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Mistake Bank Empty!
          </h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Perfect record! Any words you misspell during practice sessions will accumulate here for target review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((entry) => (
            <div
              key={entry.word.id}
              className="p-5 bg-white dark:bg-[#161c28] rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl text-slate-800 dark:text-slate-100 uppercase">
                    {entry.word.word}
                  </span>
                  <button
                    onClick={() => pronouncer.speakWord(entry.word.word)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[#1cb0f6]"
                    title="Pronounce"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    [{entry.word.phonetic}]
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 italic">
                  "{entry.word.definition}"
                </div>

                <div className="flex items-center gap-3 text-xs font-extrabold text-slate-400 dark:text-slate-500 pt-1">
                  <span>Origin: <strong className="text-slate-700 dark:text-slate-300">{entry.word.origin}</strong></span>
                  <span>•</span>
                  <span>Last attempt: <strong className="text-[#ff4b4b] line-through">{entry.userAttempt}</strong></span>
                </div>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0">
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-red-100 dark:bg-red-950/80 text-[#ff4b4b] border border-red-200 dark:border-red-900 uppercase tracking-wider">
                  Missed {entry.timesWrong}x
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
                  className="mt-2 text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  Retry <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
