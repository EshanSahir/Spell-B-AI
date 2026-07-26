import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, BookOpen, Globe, Lightbulb, RefreshCw, ChevronDown, ChevronUp, Mic, ListCheck } from 'lucide-react';
import { SpellingWord, WordList, DifficultyLevel, PracticeResult } from '../types';
import { pronouncer } from '../utils/audio';
import { compareSpelling, getDifficultyBadgeColor, DetailedSpellingFeedback } from '../utils/spellingChecker';

interface PracticeSessionProps {
  currentList: WordList;
  selectedDifficulty: DifficultyLevel;
  onRecordResult: (result: PracticeResult, word: SpellingWord) => void;
  onChangeListClick: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  currentList,
  selectedDifficulty,
  onRecordResult,
  onChangeListClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAttempt, setUserAttempt] = useState<string>('');
  const [feedback, setFeedback] = useState<DetailedSpellingFeedback | null>(null);
  
  // Clue toggles
  const [showDefinition, setShowDefinition] = useState<boolean>(false);
  const [showOrigin, setShowOrigin] = useState<boolean>(false);
  const [showPOS, setShowPOS] = useState<boolean>(false);
  const [showSentence, setShowSentence] = useState<boolean>(false);
  const [showSyllables, setShowSyllables] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // AI Feedback
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isLoadingAiAdvice, setIsLoadingAiAdvice] = useState<boolean>(false);

  // Time tracking
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter list words by active difficulty if needed, or fallback to current list
  const activeWords = currentList.words.length > 0
    ? currentList.words
    : [];

  const currentWord: SpellingWord | undefined = activeWords[currentIndex];

  useEffect(() => {
    // Reset state when word changes
    setUserAttempt('');
    setFeedback(null);
    setShowDefinition(false);
    setShowOrigin(false);
    setShowPOS(false);
    setShowSentence(false);
    setShowSyllables(false);
    setHintsUsedCount(0);
    setAiAdvice('');
    setWordStartTime(Date.now());

    // Auto pronounce on word change
    if (currentWord) {
      setTimeout(() => {
        pronouncer.speakWord(currentWord.word);
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    }
  }, [currentIndex, currentList]);

  if (!currentWord || activeWords.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-slate-800 shadow-md">
        <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-amber-100 mb-2">
          No Words Available in this List
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Please select a different word list or generate a custom AI list for {selectedDifficulty} level.
        </p>
        <button
          onClick={onChangeListClick}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-sm transition-all"
        >
          Browse & Generate Word Lists
        </button>
      </div>
    );
  }

  const handleToggleClue = (type: 'def' | 'origin' | 'pos' | 'sentence' | 'syllables') => {
    let newlyRevealed = false;
    if (type === 'def' && !showDefinition) { setShowDefinition(true); newlyRevealed = true; }
    if (type === 'origin' && !showOrigin) { setShowOrigin(true); newlyRevealed = true; }
    if (type === 'pos' && !showPOS) { setShowPOS(true); newlyRevealed = true; }
    if (type === 'sentence' && !showSentence) {
      setShowSentence(true);
      newlyRevealed = true;
      pronouncer.speakSentence(currentWord.sampleSentence);
    }
    if (type === 'syllables' && !showSyllables) { setShowSyllables(true); newlyRevealed = true; }

    if (newlyRevealed) {
      setHintsUsedCount(prev => prev + 1);
    }
  };

  const handleSubmitSpelling = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAttempt.trim() || feedback) return;

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - wordStartTime) / 1000));
    const resultDetails = compareSpelling(currentWord.word, userAttempt);
    setFeedback(resultDetails);

    const result: PracticeResult = {
      id: `res-${Date.now()}`,
      wordId: currentWord.id,
      word: currentWord.word,
      userAttempt: userAttempt.trim(),
      isCorrect: resultDetails.isCorrect,
      timestamp: Date.now(),
      timeSpentSeconds,
      difficulty: currentWord.difficulty || selectedDifficulty,
      hintsUsed: hintsUsedCount,
    };

    onRecordResult(result, currentWord);

    // If incorrect, automatically ask AI for advice in background
    if (!resultDetails.isCorrect) {
      fetchAiAdvice(currentWord, userAttempt.trim());
    }
  };

  const fetchAiAdvice = async (word: SpellingWord, attempt: string) => {
    setIsLoadingAiAdvice(true);
    try {
      const res = await fetch('/api/ai-spelling-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: word.word,
          userAttempt: attempt,
          origin: word.origin,
          definition: word.definition,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiAdvice(data.explanation);
      }
    } catch (err) {
      console.error('Failed to get AI advice', err);
    } finally {
      setIsLoadingAiAdvice(false);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < activeWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back or prompt finish
      setCurrentIndex(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Session Header Banner */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${getDifficultyBadgeColor(currentWord.difficulty || selectedDifficulty)}`}>
              {currentWord.difficulty || selectedDifficulty}
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentList.category}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-amber-100 mt-1">
            {currentList.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block font-semibold">Word Progress</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">
              {currentIndex + 1} / {activeWords.length}
            </span>
          </div>
          <button
            onClick={onChangeListClick}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold border border-amber-200 dark:border-slate-700 transition-colors"
            title="Switch List"
          >
            Switch List
          </button>
        </div>
      </div>

      {/* Main Dictation Card */}
      <div className="bg-gradient-to-b from-amber-50/60 to-white dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Audio Pronunciation Controls */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-950/60 rounded-full border border-amber-300 dark:border-amber-800/60 mb-1">
            <Volume2 className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-bounce" />
          </div>

          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Listen to the judge's pronunciation:
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => pronouncer.speakWord(currentWord.word)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-2xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              Pronounce Word
            </button>

            <button
              onClick={() => pronouncer.speakWord(currentWord.word, true)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-2xl border border-amber-200 dark:border-slate-700 flex items-center gap-2 text-sm transition-all"
            >
              <Volume1 className="w-4 h-4 text-amber-600" />
              Slow (0.6x)
            </button>

            <button
              onClick={() => pronouncer.spellOutLetters(currentWord.word)}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-2xl border border-amber-200 dark:border-slate-700 flex items-center gap-1.5 text-xs transition-all"
              title="Spell out letter sound guide"
            >
              Spell Out
            </button>
          </div>

          <p className="text-xs text-amber-800/80 dark:text-amber-300/70 font-mono italic">
            Phonetic: {currentWord.phonetic}
          </p>
        </div>

        {/* Spelling Clues Accordion (Scripps Bee official options) */}
        <div className="border-t border-amber-200/80 dark:border-slate-800 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              Ask the Judge for Clues
            </span>
            {hintsUsedCount > 0 && (
              <span className="text-xs text-amber-600 font-medium">
                {hintsUsedCount} hint{hintsUsedCount > 1 ? 's' : ''} requested
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleToggleClue('def')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                showDefinition
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              <span className="block font-bold">Definition</span>
              <span className="text-[10px] text-slate-500">{showDefinition ? 'Revealed' : 'Click to show'}</span>
            </button>

            <button
              onClick={() => handleToggleClue('origin')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                showOrigin
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              <span className="block font-bold">Language Origin</span>
              <span className="text-[10px] text-slate-500">{showOrigin ? 'Revealed' : 'Click to show'}</span>
            </button>

            <button
              onClick={() => handleToggleClue('pos')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                showPOS
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              <span className="block font-bold">Part of Speech</span>
              <span className="text-[10px] text-slate-500">{showPOS ? 'Revealed' : 'Click to show'}</span>
            </button>

            <button
              onClick={() => handleToggleClue('sentence')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                showSentence
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              <span className="block font-bold">Sample Sentence</span>
              <span className="text-[10px] text-slate-500">{showSentence ? 'Revealed' : 'Click to show'}</span>
            </button>
          </div>

          {/* Clue Details Panel */}
          {(showDefinition || showOrigin || showPOS || showSentence || showSyllables) && (
            <div className="bg-amber-100/50 dark:bg-slate-900/80 rounded-2xl p-4 border border-amber-200 dark:border-slate-800 space-y-2 text-sm text-slate-800 dark:text-slate-200 animate-fadeIn">
              {showDefinition && (
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-xs uppercase block">Definition:</span>
                  <p className="italic">{currentWord.definition}</p>
                </div>
              )}

              {showOrigin && (
                <div className="pt-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-xs uppercase block">Language of Origin:</span>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">🌍 {currentWord.origin}</p>
                </div>
              )}

              {showPOS && (
                <div className="pt-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-xs uppercase block">Part of Speech:</span>
                  <p className="capitalize font-medium">{currentWord.partOfSpeech}</p>
                </div>
              )}

              {showSentence && (
                <div className="pt-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-xs uppercase block">Sentence Context:</span>
                  <p className="italic">"{currentWord.sampleSentence}"</p>
                </div>
              )}

              {showSyllables && (
                <div className="pt-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-xs uppercase block">Syllables:</span>
                  <p className="font-mono tracking-widest">{currentWord.syllables || currentWord.word}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Spelling Input & Submission Form */}
        <form onSubmit={handleSubmitSpelling} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Enter Your Spelling Attempt:
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                disabled={feedback !== null}
                value={userAttempt}
                onChange={(e) => setUserAttempt(e.target.value)}
                placeholder="Type word here..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className="w-full px-5 py-4 text-2xl font-black tracking-wide text-slate-900 dark:text-amber-100 bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 shadow-inner disabled:opacity-80"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                {userAttempt.length} chars
              </span>
            </div>
          </div>

          {!feedback ? (
            <button
              type="submit"
              disabled={!userAttempt.trim()}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-lg rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              Submit Spelling for Instant Feedback
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextWord}
              className="w-full py-4 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Next Word ({currentIndex + 1}/{activeWords.length})
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Instant Feedback Analysis Results */}
        {feedback && (
          <div className={`p-6 rounded-2xl border ${
            feedback.isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
          } space-y-4 animate-scaleUp`}>
            
            {/* Outcome Banner */}
            <div className="flex items-start gap-3">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              )}

              <div>
                <h4 className={`text-xl font-black ${
                  feedback.isCorrect ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'
                }`}>
                  {feedback.isCorrect ? 'Correct Spelling!' : 'Not Quite Right'}
                </h4>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {feedback.summaryNote}
                </p>
              </div>
            </div>

            {/* Letter-by-Letter Visual Comparison Breakdown */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 border border-amber-200/50 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Letter-by-Letter Analysis:
              </div>

              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xl">
                {feedback.letters.map((item, idx) => {
                  if (item.status === 'correct') {
                    return (
                      <span key={idx} className="w-10 h-12 rounded-lg bg-emerald-500 text-white font-black flex items-center justify-center shadow-xs">
                        {item.char}
                      </span>
                    );
                  } else if (item.status === 'wrong') {
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="w-10 h-12 rounded-lg bg-rose-500 text-white font-black flex items-center justify-center shadow-xs">
                          {item.char}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          ↳ {item.expectedChar}
                        </span>
                      </div>
                    );
                  } else if (item.status === 'missing') {
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="w-10 h-12 rounded-lg bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black border-2 border-dashed border-amber-400 flex items-center justify-center">
                          ?
                        </span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                          + {item.expectedChar}
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <span key={idx} className="w-10 h-12 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 line-through font-black flex items-center justify-center">
                        {item.char}
                      </span>
                    );
                  }
                })}
              </div>

              {!feedback.isCorrect && (
                <div className="pt-2 text-sm">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Correct Full Spelling: </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-lg uppercase tracking-wider">
                    {currentWord.word}
                  </span>
                </div>
              )}
            </div>

            {/* Etymology Mnemonic Memory Trick */}
            {currentWord.mnemonic && (
              <div className="flex items-start gap-2 bg-amber-100/60 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-300/60 text-xs text-amber-950 dark:text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Mnemonic Memory Hook: </span>
                  {currentWord.mnemonic}
                </div>
              </div>
            )}

            {/* AI Custom Coach Explanation */}
            {!feedback.isCorrect && (
              <div className="pt-2">
                {isLoadingAiAdvice ? (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Asking Gemini AI Spelling Coach for mistake analysis...
                  </div>
                ) : aiAdvice ? (
                  <div className="bg-amber-50 dark:bg-slate-900 p-4 rounded-xl border border-amber-300 dark:border-amber-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Gemini AI Etymological Coach Analysis:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiAdvice}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
