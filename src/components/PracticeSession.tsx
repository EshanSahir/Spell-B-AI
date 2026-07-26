import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, BookOpen, Lightbulb, RefreshCw, Heart, X, Zap } from 'lucide-react';
import { SpellingWord, WordList, DifficultyLevel, PracticeResult } from '../types';
import { pronouncer } from '../utils/audio';
import { compareSpelling, getDifficultyBadgeColor, DetailedSpellingFeedback } from '../utils/spellingChecker';

interface PracticeSessionProps {
  currentList: WordList;
  selectedDifficulty: DifficultyLevel;
  onRecordResult: (result: PracticeResult, word: SpellingWord) => void;
  onChangeListClick: () => void;
  onNavigateToMistakes?: () => void;
  hasMistakes?: boolean;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  currentList,
  selectedDifficulty,
  onRecordResult,
  onChangeListClick,
  onNavigateToMistakes,
  hasMistakes = false,
}) => {
  // Session queue containing exactly the words from currentList shuffled once (no repeats!)
  const [sessionQueue, setSessionQueue] = useState<SpellingWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [isLessonComplete, setIsLessonComplete] = useState<boolean>(false);

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

  // Restart/Initialize session with a fresh, non-repeating shuffled queue
  const startFreshSession = () => {
    if (currentList.words && currentList.words.length > 0) {
      const shuffled = [...currentList.words].sort(() => Math.random() - 0.5);
      setSessionQueue(shuffled);
      setCurrentIndex(0);
      setSessionCorrectCount(0);
      setIsLessonComplete(false);
    } else {
      setSessionQueue([]);
    }
  };

  useEffect(() => {
    startFreshSession();
  }, [currentList]);

  const currentWord: SpellingWord | undefined = sessionQueue[currentIndex];

  useEffect(() => {
    // Reset word level state
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
    if (currentWord && !isLessonComplete) {
      const timer = setTimeout(() => {
        pronouncer.speakWord(currentWord.word);
        if (inputRef.current) inputRef.current.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, sessionQueue, isLessonComplete]);

  if (isLessonComplete) {
    const totalWords = sessionQueue.length;
    const accuracy = totalWords > 0 ? Math.round((sessionCorrectCount / totalWords) * 100) : 100;
    const xpEarned = sessionCorrectCount * 10 + 20;

    return (
      <div className="max-w-2xl mx-auto my-8 p-8 sm:p-12 text-center bg-white dark:bg-[#161c28] rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-[#58cc02] text-white flex items-center justify-center font-black text-5xl mx-auto border-b-6 border-[#46a302] shadow-lg animate-bounce">
            🦉
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#ff9600] text-white font-black text-xs px-3 py-1 rounded-full border-2 border-white dark:border-[#161c28] uppercase">
            🎉 Finished!
          </div>
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Lesson Complete!
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">
            You practiced all {totalWords} words in <span className="text-[#1cb0f6]">{currentList.title}</span> without repeating!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block">Total XP</span>
            <span className="text-xl sm:text-2xl font-black text-[#ff9600]">+{xpEarned} XP</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block">Accuracy</span>
            <span className="text-xl sm:text-2xl font-black text-[#58cc02]">{accuracy}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block">Correct</span>
            <span className="text-xl sm:text-2xl font-black text-[#1cb0f6]">{sessionCorrectCount}/{totalWords}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={startFreshSession}
            className="w-full sm:w-auto px-8 py-4 bg-[#58cc02] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Practice List Again
          </button>

          <button
            onClick={onChangeListClick}
            className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black text-sm uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Other Libraries
          </button>

          {hasMistakes && onNavigateToMistakes && (
            <button
              onClick={onNavigateToMistakes}
              className="w-full sm:w-auto px-8 py-4 bg-[#ff4b4b] hover:bg-[#ff5959] active:translate-y-1 active:border-b-0 border-b-4 border-[#ea2b2b] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Review Mistakes
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentWord || sessionQueue.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white dark:bg-[#161c28] rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#58cc02] text-white flex items-center justify-center font-black text-3xl mx-auto border-b-4 border-[#46a302]">
          🦉
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          No Words Available
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold">
          Please choose another word list or generate a custom AI word list.
        </p>
        <button
          onClick={onChangeListClick}
          className="px-8 py-3.5 bg-[#58cc02] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-sm transition-all"
        >
          Select Word Library
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

    if (resultDetails.isCorrect) {
      setSessionCorrectCount(prev => prev + 1);
    } else {
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
    // When user reaches end of session queue, show Lesson Complete screen!
    if (currentIndex + 1 >= sessionQueue.length) {
      setIsLessonComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Progress percentage through current list
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / sessionQueue.length) * 100));

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28">
      
      {/* Duolingo Lesson Top Header Bar */}
      <div className="flex items-center gap-4 bg-white dark:bg-[#161c28] p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <button
          onClick={onChangeListClick}
          className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-b-2 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold flex items-center justify-center transition-all flex-shrink-0"
          title="Quit Lesson"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Green Animated Duolingo Progress Bar */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
          <div 
            className="bg-[#58cc02] h-full rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        {/* List Counter Badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0 font-black text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>{currentIndex + 1} / {sessionQueue.length}</span>
        </div>
      </div>

      {/* Main Duolingo Practice Card */}
      <div className="bg-white dark:bg-[#161c28] p-6 sm:p-10 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
        
        {/* Title Prompt */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-100 tracking-tight">
            Listen and type what you hear
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <span className="uppercase tracking-wider font-extrabold text-[#1cb0f6] bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-lg border border-sky-200 dark:border-sky-800">
              {currentWord.difficulty || selectedDifficulty}
            </span>
            <span>•</span>
            <span>{currentList.title}</span>
          </div>
        </div>

        {/* Giant Duolingo Speaker Buttons */}
        <div className="flex items-center justify-center gap-4 py-2">
          {/* Main Pronunciation Speaker */}
          <button
            onClick={() => pronouncer.speakWord(currentWord.word)}
            className="w-24 h-24 rounded-3xl bg-[#1cb0f6] hover:bg-[#20bdff] active:translate-y-1 active:border-b-0 border-b-6 border-[#1899d6] text-white flex flex-col items-center justify-center shadow-md transition-all group"
            title="Click to Listen"
          >
            <Volume2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-wider mt-1">Normal</span>
          </button>

          {/* Slow Speech Button */}
          <button
            onClick={() => pronouncer.speakWord(currentWord.word, true)}
            className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 border-b-4 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#1cb0f6] flex flex-col items-center justify-center transition-all group active:translate-y-0.5"
            title="Slow Speech (0.6x)"
          >
            <Volume1 className="w-7 h-7 text-[#1cb0f6] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500">Slow</span>
          </button>

          {/* Letter Guide */}
          <button
            onClick={() => pronouncer.spellOutLetters(currentWord.word)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all"
            title="Spell letters out"
          >
            🔊 Spell Out
          </button>
        </div>

        <div className="text-center font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
          Phonetic guide: <span className="text-slate-600 dark:text-slate-300">[{currentWord.phonetic}]</span>
        </div>

        {/* Duolingo Clues Accordion Pills */}
        <div className="pt-2 border-t-2 border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#ffc800] fill-[#ffc800]" />
              Need a clue?
            </span>
            {hintsUsedCount > 0 && (
              <span className="text-[#1cb0f6]">
                {hintsUsedCount} hint{hintsUsedCount > 1 ? 's' : ''} used
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleToggleClue('def')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-b-4 transition-all ${
                showDefinition
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 border-b-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-b-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              💡 Definition
            </button>

            <button
              onClick={() => handleToggleClue('origin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-b-4 transition-all ${
                showOrigin
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 border-b-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-b-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              🌍 Origin ({currentWord.origin})
            </button>

            <button
              onClick={() => handleToggleClue('pos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-b-4 transition-all ${
                showPOS
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 border-b-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-b-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Grammar
            </button>

            <button
              onClick={() => handleToggleClue('sentence')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-b-4 transition-all ${
                showSentence
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 border-b-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-b-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              📝 Sentence
            </button>
          </div>

          {/* Expanded Clue Details Card */}
          {(showDefinition || showOrigin || showPOS || showSentence || showSyllables) && (
            <div className="bg-sky-50/80 dark:bg-sky-950/40 rounded-2xl p-4 border-2 border-sky-200 dark:border-sky-800 space-y-2 text-xs text-sky-950 dark:text-sky-100 font-bold">
              {showDefinition && (
                <div>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-extrabold block">Definition:</span>
                  <p className="text-slate-800 dark:text-slate-200 text-sm italic">"{currentWord.definition}"</p>
                </div>
              )}

              {showOrigin && (
                <div>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-extrabold block">Language Origin:</span>
                  <p className="text-slate-800 dark:text-slate-200 text-sm">🌍 {currentWord.origin}</p>
                </div>
              )}

              {showPOS && (
                <div>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-extrabold block">Part of Speech:</span>
                  <p className="capitalize text-slate-800 dark:text-slate-200">{currentWord.partOfSpeech}</p>
                </div>
              )}

              {showSentence && (
                <div>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-extrabold block">Example Usage:</span>
                  <p className="text-slate-800 dark:text-slate-200 italic">"{currentWord.sampleSentence}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Duolingo Spelling Input Form */}
        <form onSubmit={handleSubmitSpelling} className="space-y-4 pt-2">
          <div className="w-full">
            <input
              ref={inputRef}
              type="text"
              disabled={feedback !== null}
              value={userAttempt}
              onChange={(e) => setUserAttempt(e.target.value)}
              placeholder="Type your answer..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full text-center text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-[#1cb0f6] focus:bg-white dark:focus:bg-slate-900 rounded-2xl p-5 shadow-inner outline-none uppercase placeholder:normal-case transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
        </form>

      </div>

      {/* Authentic Duolingo Sticky Bottom Sheet Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#161c28] border-t-2 border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 transition-all">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          {!feedback ? (
            /* Unsubmitted state: Giant Green CHECK Button */
            <div className="w-full flex items-center justify-between gap-4">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 hidden sm:inline uppercase tracking-wider">
                Word {currentIndex + 1} of {sessionQueue.length}
              </span>
              <button
                type="button"
                onClick={() => handleSubmitSpelling()}
                disabled={!userAttempt.trim()}
                className="w-full sm:w-auto px-12 py-4 bg-[#58cc02] hover:bg-[#61e002] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:border-slate-300 dark:disabled:border-slate-700 disabled:text-slate-400 dark:disabled:text-slate-600 border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 text-white font-black text-base uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
              >
                CHECK
              </button>
            </div>
          ) : feedback.isCorrect ? (
            /* CORRECT FEEDBACK BANNER */
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#d7ffb8] dark:bg-[#1d3d0e] -m-4 sm:-m-6 p-4 sm:p-6 border-t-2 border-[#b8f28b] dark:border-[#2a5c13]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#58cc02] text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#58a700] dark:text-[#72f00a]">
                    You are correct!
                  </h4>
                  <p className="text-xs font-bold text-[#58a700]/90 dark:text-[#72f00a]/90">
                    +10 XP • Perfect Spelling!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextWord}
                className="w-full sm:w-auto px-10 py-3.5 bg-[#58cc02] hover:bg-[#61e002] border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 text-white font-black text-base uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                CONTINUE
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* INCORRECT FEEDBACK BANNER */
            <div className="w-full flex flex-col items-start gap-4 bg-[#ffdfe0] dark:bg-[#401214] -m-4 sm:-m-6 p-4 sm:p-6 border-t-2 border-[#ffc1c4] dark:border-[#6b1e22]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                    ✕
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#ea2b2b] dark:text-[#ff6b6b] uppercase tracking-wider">
                      Correct solution:
                    </h4>
                    <p className="text-2xl font-black text-[#ea2b2b] dark:text-[#ff6b6b] tracking-wide uppercase">
                      {currentWord.word}
                    </p>
                    <p className="text-xs font-bold text-[#ea2b2b]/80 dark:text-[#ff6b6b]/80 mt-0.5">
                      Your attempt: "{userAttempt}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextWord}
                  className="w-full sm:w-auto px-10 py-3.5 bg-[#ff4b4b] hover:bg-[#ff5959] border-b-4 border-[#ea2b2b] active:translate-y-1 active:border-b-0 text-white font-black text-base uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  CONTINUE
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* AI Advice explanation if loading or present */}
              {isLoadingAiAdvice ? (
                <div className="flex items-center gap-2 text-xs font-bold text-[#ea2b2b] dark:text-[#ff6b6b]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Duo Coach is generating feedback...
                </div>
              ) : aiAdvice ? (
                <div className="w-full bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl border border-[#ffc1c4] dark:border-[#6b1e22] text-xs text-slate-700 dark:text-slate-200 font-bold">
                  🦉 <strong>Duo Tip:</strong> {aiAdvice}
                </div>
              ) : null}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};


