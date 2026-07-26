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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Performance Analytics & Report
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-amber-100">
            Spelling Bee Mastery Summary
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Track daily practice streaks, accuracy trends, and difficulty level progression.
          </p>
        </div>

        <button
          onClick={exportSummaryReport}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Accuracy Rate</span>
            <TrendingUp className="w-5 h-5 opacity-90" />
          </div>
          <div className="text-3xl font-black">{overallAccuracy}%</div>
          <p className="text-[11px] font-medium opacity-90">
            {stats.totalCorrect} of {stats.totalAttempted} spelled correctly
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Practice Streak</span>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-amber-100">
            {stats.streakDays} <span className="text-lg font-normal text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-500">Consecutive daily training</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Words Mastered</span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-amber-100">
            {stats.masteredWords.length}
          </div>
          <p className="text-[11px] text-slate-500">Unique words answered right</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Attempted</span>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-amber-100">
            {stats.totalAttempted}
          </div>
          <p className="text-[11px] text-slate-500">Spelling bee drills logged</p>
        </div>

      </div>

      {/* Difficulty Breakdown Cards */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-amber-100">
            Accuracy by Difficulty Tier
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['beginner', 'intermediate', 'advanced', 'championship'] as DifficultyLevel[]).map((diff) => {
            const data = difficultyStats[diff];
            const acc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;

            return (
              <div key={diff} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getDifficultyBadgeColor(diff)}`}>
                    {diff}
                  </span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">{acc}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{ width: `${acc}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  {data.correct} correct out of {data.attempted} attempts
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Progress Timeline */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-amber-100">
              Daily Practice History Log
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Last {stats.dailyHistory.length} active sessions
          </span>
        </div>

        {stats.dailyHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No daily records yet. Complete your first dictation session to start tracking daily progress!
          </div>
        ) : (
          <div className="space-y-2">
            {stats.dailyHistory.slice().reverse().map((day) => {
              const dayAcc = day.wordsAttempted > 0 ? Math.round((day.wordsCorrect / day.wordsAttempted) * 100) : 0;

              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {day.date}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {day.wordsAttempted} words practiced
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {day.wordsCorrect} correct
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      dayAcc >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      dayAcc >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
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
