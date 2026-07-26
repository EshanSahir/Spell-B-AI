import React from 'react';
import { Award, BookOpen, Brain, Flame, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { getDifficultyBadgeColor, formatDifficultyName } from '../utils/spellingChecker';

interface HeaderProps {
  activeTab: 'practice' | 'lists' | 'report' | 'mistakes' | 'coach';
  setActiveTab: (tab: 'practice' | 'lists' | 'report' | 'mistakes' | 'coach') => void;
  selectedDifficulty: DifficultyLevel;
  setSelectedDifficulty: (diff: DifficultyLevel) => void;
  streakDays: number;
  todayCorrect: number;
  todayAttempted: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDifficulty,
  setSelectedDifficulty,
  streakDays,
  todayCorrect,
  todayAttempted,
}) => {
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'championship'];

  return (
    <header className="sticky top-0 z-40 bg-amber-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-200/80 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo / Title */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setActiveTab('practice')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                🐝
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-amber-100 flex items-center gap-2">
                  SpellBee <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold border border-amber-400/30">AI Studio</span>
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">National Competition Trainer & Pronouncer</p>
              </div>
            </div>

            {/* Quick Stats Badges for Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>{streakDays}d</span>
              </div>
            </div>
          </div>

          {/* Difficulty Selector Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
              Difficulty:
            </span>
            <div className="inline-flex rounded-lg p-1 bg-amber-100/70 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap capitalize ${
                    selectedDifficulty === diff
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-amber-200'
                  }`}
                  title={formatDifficultyName(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Streak & Today Progress Widget (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-300/50 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs font-medium">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <div>
                <span className="font-bold">{streakDays} Day</span> Streak
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300/50 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 text-xs">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                Today: <span className="font-bold">{todayCorrect}/{todayAttempted}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 overflow-x-auto pt-1 border-t border-amber-200/50 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'practice'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Spelling Dictation
          </button>

          <button
            onClick={() => setActiveTab('lists')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'lists'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Word Lists & AI
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Progress & Report
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'mistakes'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Mistake Bank
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'coach'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            AI Coach
          </button>
        </nav>
      </div>
    </header>
  );
};
