import React from 'react';
import { Award, BookOpen, Brain, Flame, Sparkles, Volume2, RotateCcw, Heart, Gem, Sun, Moon } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { formatDifficultyName } from '../utils/spellingChecker';

interface HeaderProps {
  activeTab: 'practice' | 'lists' | 'report' | 'mistakes' | 'coach';
  setActiveTab: (tab: 'practice' | 'lists' | 'report' | 'mistakes' | 'coach') => void;
  selectedDifficulty: DifficultyLevel;
  setSelectedDifficulty: (diff: DifficultyLevel) => void;
  streakDays: number;
  todayCorrect: number;
  todayAttempted: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDifficulty,
  setSelectedDifficulty,
  streakDays,
  todayCorrect,
  todayAttempted,
  isDarkMode,
  toggleDarkMode,
}) => {
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'championship'];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#161c28] border-b-2 border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo / Duolingo Style Branding */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setActiveTab('practice')} 
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              {/* Duolingo Duo Owl Icon */}
              <div className="w-10 h-10 rounded-2xl bg-[#58cc02] text-white flex items-center justify-center font-black text-2xl border-b-4 border-[#46a302] shadow-sm group-hover:scale-105 active:scale-95 transition-all">
                🦉
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#58cc02] flex items-center gap-1.5 lowercase">
                  duolingo <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-xl bg-[#e5f8d0] dark:bg-[#1e3a10] text-[#58a700] dark:text-[#72f00a] border border-[#b8f28b] dark:border-[#336611]">spelling</span>
                </h1>
              </div>
            </div>

            {/* Quick Stats Badges & Mobile Theme Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 fill-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
              <div className="flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#ff9600] border border-amber-200 dark:border-amber-800">
                <Flame className="w-4 h-4 fill-[#ff9600]" />
                <span>{streakDays}</span>
              </div>
            </div>
          </div>

          {/* Difficulty Selector Toggle & Theme Switcher */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
              Level:
            </span>
            <div className="inline-flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-xl transition-all whitespace-nowrap ${
                    selectedDifficulty === diff
                      ? 'bg-[#58cc02] text-white shadow-sm border-b-2 border-[#46a302]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                  title={formatDifficultyName(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Theme Switcher Button (Desktop) */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-amber-300 transition-all active:scale-95"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="uppercase tracking-wider">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                  <span className="uppercase tracking-wider">Night</span>
                </>
              )}
            </button>
          </div>

          {/* Duolingo Header Widgets (Desktop Stats Bar) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Streak Widget */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 font-extrabold text-sm text-[#ff9600]">
              <Flame className="w-5 h-5 fill-[#ff9600] text-[#ff9600] animate-bounce" />
              <span>{streakDays}</span>
            </div>

            {/* Gems / XP Widget */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 font-extrabold text-sm text-[#1cb0f6]">
              <Gem className="w-5 h-5 fill-[#1cb0f6] text-[#1cb0f6]" />
              <span>{todayCorrect * 10 + 120} XP</span>
            </div>

            {/* Hearts Widget */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 font-extrabold text-sm text-[#ff4b4b]">
              <Heart className="w-5 h-5 fill-[#ff4b4b] text-[#ff4b4b]" />
              <span>5</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation Menu (Duolingo 3D Button Nav) */}
        <nav className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'practice'
                ? 'bg-[#1cb0f6] text-white border-b-4 border-[#1899d6]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Learn & Practice
          </button>

          <button
            onClick={() => setActiveTab('lists')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'lists'
                ? 'bg-[#58cc02] text-white border-b-4 border-[#46a302]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Word Libraries
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-[#ff9600] text-white border-b-4 border-[#e58700]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
            }`}
          >
            <Award className="w-4 h-4" />
            Mastery Stats
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'mistakes'
                ? 'bg-[#ff4b4b] text-white border-b-4 border-[#ea2b2b]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Mistake Bank
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'coach'
                ? 'bg-[#ce82ff] text-white border-b-4 border-[#a559d6]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
            }`}
          >
            <Brain className="w-4 h-4" />
            AI Duo Coach
          </button>
        </nav>
      </div>
    </header>
  );
};


