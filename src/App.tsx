import React, { useState, useEffect } from 'react';
import { DifficultyLevel, WordList, AppStats, PracticeResult, SpellingWord } from './types';
import { getAllWordLists, loadAppStats, recordPracticeResult, saveAppStats } from './utils/storage';
import { Header } from './components/Header';
import { PracticeSession } from './components/PracticeSession';
import { WordListManager } from './components/WordListManager';
import { ProgressReport } from './components/ProgressReport';
import { MistakeBank } from './components/MistakeBank';
import { AICoachChat } from './components/AICoachChat';

export default function App() {
  const [activeTab, setActiveTab] = useState<'practice' | 'lists' | 'report' | 'mistakes' | 'coach'>('practice');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [activeWordList, setActiveWordList] = useState<WordList | null>(null);
  const [appStats, setAppStats] = useState<AppStats>(loadAppStats());

  // Load initial lists and default list
  useEffect(() => {
    const loadedLists = getAllWordLists();
    setWordLists(loadedLists);

    if (loadedLists.length > 0) {
      // Pick first list matching default difficulty, or first list
      const matching = loadedLists.find(l => l.difficulty === selectedDifficulty) || loadedLists[0];
      setActiveWordList(matching);
    }
  }, []);

  // Update list when difficulty toggle changes in header
  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    setSelectedDifficulty(newDiff);
    const matching = wordLists.find(l => l.difficulty === newDiff);
    if (matching) {
      setActiveWordList(matching);
    }
  };

  const handleRefreshLists = () => {
    const loadedLists = getAllWordLists();
    setWordLists(loadedLists);
  };

  const handleRecordResult = (result: PracticeResult, word: SpellingWord) => {
    const updatedStats = recordPracticeResult(result, word);
    setAppStats(updatedStats);
  };

  const handleClearMistakes = () => {
    const updated = { ...appStats, mistakeBank: [] };
    saveAppStats(updated);
    setAppStats(updated);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = appStats.dailyHistory.find(d => d.date === todayStr);
  const todayCorrect = todayEntry ? todayEntry.wordsCorrect : 0;
  const todayAttempted = todayEntry ? todayEntry.wordsAttempted : 0;

  return (
    <div className="min-h-screen bg-amber-50/40 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={handleDifficultyChange}
        streakDays={appStats.streakDays}
        todayCorrect={todayCorrect}
        todayAttempted={todayAttempted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'practice' && activeWordList && (
          <PracticeSession
            currentList={activeWordList}
            selectedDifficulty={selectedDifficulty}
            onRecordResult={handleRecordResult}
            onChangeListClick={() => setActiveTab('lists')}
          />
        )}

        {activeTab === 'lists' && (
          <WordListManager
            lists={wordLists}
            selectedList={activeWordList || wordLists[0]}
            onSelectWordList={(list) => {
              setActiveWordList(list);
              setSelectedDifficulty(list.difficulty);
              setActiveTab('practice');
            }}
            selectedDifficulty={selectedDifficulty}
            onRefreshLists={handleRefreshLists}
          />
        )}

        {activeTab === 'report' && (
          <ProgressReport stats={appStats} />
        )}

        {activeTab === 'mistakes' && (
          <MistakeBank
            mistakes={appStats.mistakeBank}
            onStartPracticeList={(list) => {
              setActiveWordList(list);
              setActiveTab('practice');
            }}
            onClearMistakes={handleClearMistakes}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachChat />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/60 dark:border-slate-800 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🐝 <strong>SpellBee AI Studio</strong> — Train for National & Regional Spelling Bees</span>
          <span>Powered by Gemini 3.6 Flash & Web Speech Synthesis</span>
        </div>
      </footer>

    </div>
  );
}
