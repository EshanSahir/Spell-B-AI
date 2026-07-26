import React from 'react';
import { Award, Flame, CheckCircle, TrendingUp, Calendar, Target, BookOpen, Layers, BarChart3, Download } from 'lucide-react';
import { AppStats, DifficultyLevel } from '../types';
import { formatDifficultyName, getDifficultyBadgeColor } from '../utils/spellingChecker';

interface ProgressReportProps {
  stats: AppStats;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({ stats }) => {
  const overallAccuracy = stats.totalAttempted > 0
    ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
    : 0;

  // Calculate difficulty level metrics across history
  const difficultyStats: Record<DifficultyLevel, { attempted: number; correct: number }> = {
    beginner: { attempted: 0, correct: 0 },
    intermediate: { attempted: 0, correct: 0 },
    advanced: { attempted: 0, correct: 0 },
    championship: { attempted: 0, correct: 0 },
  };

  stats.dailyHistory.forEach(day => {
    Object.entries(day.byDifficulty || {}).forEach(([diffKey, val]) => {
      const d = diffKey as DifficultyLevel;
      const item = val as { attempted: number; correct: number };
      if (difficultyStats[d] && item) {
        difficultyStats[d].attempted += item.attempted || 0;
        difficultyStats[d].correct += item.correct || 0;
      }
    });
  });

  const exportSummaryReport = () => {
    const reportText = `=== SPELLBEE AI - DAILY PROGRESS SUMMARY REPORT ===
Date Exported: ${new Date().toLocaleDateString()}
Current Streak: ${stats.streakDays} Days
Overall Accuracy: ${overallAccuracy}% (${stats.totalCorrect} / ${stats.totalAttempted})
Total Words Mastered: ${stats.masteredWords.length}

Difficulty Breakdown:
- Beginner: ${difficultyStats.beginner.correct}/${difficultyStats.beginner.attempted}
- Intermediate: ${difficultyStats.intermediate.correct}/${difficultyStats.intermediate.attempted}
- Advanced: ${difficultyStats.advanced.correct}/${difficultyStats.advanced.attempted}
- Championship: ${difficultyStats.championship.correct}/${difficultyStats.championship.attempted}

Daily History (Last 7 Days):
${stats.dailyHistory.slice(-7).map(d => `${d.date}: ${d.wordsCorrect}/${d.wordsAttempted} correct (${d.wordsAttempted > 0 ? Math.round((d.wordsCorrect/d.wordsAttempted)*100) : 0}%)`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spellbee-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161c28] p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider block">
            Duolingo Performance Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
            Weekly Mastery Summary
          </h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Track daily practice streaks, accuracy trends, and difficulty tier progression.
          </p>
        </div>

        <button
          onClick={exportSummaryReport}
          className="px-5 py-3 bg-[#1cb0f6] hover:bg-[#20bdff] active:translate-y-1 active:border-b-0 border-b-4 border-[#1899d6] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#e5f8d0] dark:bg-[#1e3a10] border-2 border-[#b8f28b] dark:border-[#336611] p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#58a700] dark:text-[#72f00a]">
            <span className="text-xs font-black uppercase tracking-wider">Spelling Quotient</span>
            <TrendingUp className="w-5 h-5 text-[#58cc02]" />
          </div>
          <div className="text-4xl font-black text-[#58a700] dark:text-[#72f00a]">{overallAccuracy * 14 + 200}</div>
          <div className="w-full bg-white/60 dark:bg-black/30 h-2 mt-2 rounded-full overflow-hidden border border-[#b8f28b] dark:border-[#336611]">
            <div className="bg-[#58cc02] h-full transition-all duration-500" style={{ width: `${overallAccuracy}%` }}></div>
          </div>
          <div className="text-right text-[10px] text-[#58a700] dark:text-[#72f00a] mt-1 font-black uppercase tracking-wider">Top {Math.max(1, 100 - overallAccuracy)}%</div>
        </div>

        <div className="bg-white dark:bg-[#161c28] p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider">Streak</span>
            <Flame className="w-5 h-5 text-[#ff9600] fill-[#ff9600]" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {stats.streakDays} <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Days</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">Consecutive Days</p>
        </div>

        <div className="bg-white dark:bg-[#161c28] p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider">Mastered</span>
            <Award className="w-5 h-5 text-[#58cc02]" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {stats.masteredWords.length}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">Words Answered Right</p>
        </div>

        <div className="bg-white dark:bg-[#161c28] p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-black uppercase tracking-wider">Total Drills</span>
            <Target className="w-5 h-5 text-[#1cb0f6]" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {stats.totalAttempted}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">Attempts Recorded</p>
        </div>

      </div>

      {/* Difficulty Breakdown Cards */}
      <div className="bg-white dark:bg-[#161c28] p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#1cb0f6]" />
          <h3 className="text-base font-black text-slate-700 dark:text-slate-200 tracking-tight">
            Accuracy by Difficulty Tier
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['beginner', 'intermediate', 'advanced', 'championship'] as DifficultyLevel[]).map((diff) => {
            const data = difficultyStats[diff];
            const acc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;

            return (
              <div key={diff} className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-xl font-black uppercase tracking-wider border ${getDifficultyBadgeColor(diff)}`}>
                    {diff}
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{acc}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                  <div
                    className="bg-[#58cc02] h-full transition-all duration-500"
                    style={{ width: `${acc}%` }}
                  />
                </div>

                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {data.correct} / {data.attempted} Correct
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Progress Timeline */}
      <div className="bg-white dark:bg-[#161c28] p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#ff9600]" />
            <h3 className="text-base font-black text-slate-700 dark:text-slate-200 tracking-tight">
              Daily Practice History Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            Last {stats.dailyHistory.length} active sessions
          </span>
        </div>

        {stats.dailyHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-bold">
            No daily records yet. Complete your first dictation session to start tracking daily progress!
          </div>
        ) : (
          <div className="space-y-2">
            {stats.dailyHistory.slice().reverse().map((day) => {
              const dayAcc = day.wordsAttempted > 0 ? Math.round((day.wordsCorrect / day.wordsAttempted) * 100) : 0;

              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-800 dark:text-slate-100 text-sm">
                      {day.date}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {day.wordsAttempted} words practiced
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-300">
                      {day.wordsCorrect} correct
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                      dayAcc >= 80 ? 'bg-[#d7ffb8] dark:bg-[#1d3d0e] text-[#58a700] dark:text-[#72f00a] border-[#b8f28b] dark:border-[#2a5c13]' :
                      dayAcc >= 50 ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                      'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                      {dayAcc}% Accuracy
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
