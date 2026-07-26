import React, { useState } from 'react';
import { BookOpen, Sparkles, Plus, Search, Check, Layers, ArrowRight, Library, Wand2 } from 'lucide-react';
import { WordList, DifficultyLevel, SpellingWord } from '../types';
import { formatDifficultyName, getDifficultyBadgeColor } from '../utils/spellingChecker';
import { saveCustomWordList } from '../utils/storage';

interface WordListManagerProps {
  lists: WordList[];
  selectedList: WordList;
  onSelectWordList: (list: WordList) => void;
  selectedDifficulty: DifficultyLevel;
  onRefreshLists: () => void;
}

export const WordListManager: React.FC<WordListManagerProps> = ({
  lists,
  selectedList,
  onSelectWordList,
  selectedDifficulty,
  onRefreshLists,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // AI Generator state
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('');
  const [aiDifficulty, setAiDifficulty] = useState<DifficultyLevel>('intermediate');
  const [aiWordCount, setAiWordCount] = useState<number>(8);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string>('');

  const filteredLists = lists.filter(list => {
    const matchesDifficulty = filterDifficulty === 'all' || list.difficulty === filterDifficulty;
    const matchesSearch = searchQuery === '' || 
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.words.some(w => w.word.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const handleGenerateAiList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    setGeneratorError('');

    try {
      const res = await fetch('/api/generate-wordlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          difficulty: aiDifficulty,
          count: aiWordCount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.wordList) {
        throw new Error(data.error || 'Failed to generate word list');
      }

      // Save custom list to storage
      saveCustomWordList(data.wordList);
      onRefreshLists();
      onSelectWordList(data.wordList);
      setShowAiGeneratorModal(false);
      setAiTopic('');
    } catch (err: any) {
      console.error('Error generating list:', err);
      setGeneratorError(err.message || 'Error generating list with Gemini AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const presetTopics = [
    'French Loanwords with Silent Letters',
    'Greek Medical & Scientific Terminology',
    'Tricky Double Consonant Words',
    'Scripps Championship Final Words',
    'Botanical & Wildlife Terminology',
    'Italian Musical & Literary Words',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header & AI Generator Trigger Banner */}
      <div className="bg-white dark:bg-[#161c28] text-slate-800 dark:text-slate-100 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-[#e5f8d0] dark:bg-[#1e3a10] text-[#58a700] dark:text-[#72f00a] text-xs font-black uppercase tracking-wider border border-[#b8f28b] dark:border-[#336611]">
            <Sparkles className="w-4 h-4 text-[#58cc02]" />
            AI Word List Generator
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Duolingo Word Libraries
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-xl">
            Select competition word sets or generate custom AI lists focused on specific origins, roots, or difficulty levels.
          </p>
        </div>

        <button
          onClick={() => setShowAiGeneratorModal(true)}
          className="px-6 py-3.5 bg-[#58cc02] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Wand2 className="w-4 h-4" />
          Generate AI Word List
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161c28] p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        
        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              filterDifficulty === 'all'
                ? 'bg-[#1cb0f6] text-white border-b-2 border-[#1899d6]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Difficulties
          </button>
          {(['beginner', 'intermediate', 'advanced', 'championship'] as DifficultyLevel[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all capitalize whitespace-nowrap ${
                filterDifficulty === diff
                  ? 'bg-[#1cb0f6] text-white border-b-2 border-[#1899d6]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words or topics..."
            className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1cb0f6] placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLists.map((list) => {
          const isSelected = selectedList.id === list.id;
          return (
            <div
              key={list.id}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-sky-50/60 dark:bg-sky-950/40 border-[#1cb0f6] shadow-sm'
                  : 'bg-white dark:bg-[#161c28] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-xl font-extrabold border uppercase tracking-wider ${getDifficultyBadgeColor(list.difficulty)}`}>
                    {list.difficulty}
                  </span>
                  {list.isCustom && (
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#ff9600]" /> AI Generated
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                  {list.title}
                </h3>

                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-2">
                  {list.description}
                </p>
              </div>

              {/* Sample words preview */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {list.words.length} Words, e.g.:
                </span>
                <div className="flex flex-wrap gap-1">
                  {list.words.slice(0, 4).map((w) => (
                    <span key={w.id} className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      {w.word}
                    </span>
                  ))}
                  {list.words.length > 4 && (
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 self-center">
                      +{list.words.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectWordList(list)}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider border-b-4 transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#58cc02] border-[#46a302] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 border-b-4 border-slate-300 dark:border-slate-600'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" /> Active Selection
                  </>
                ) : (
                  <>
                    Practice Library
                    <ArrowRight className="w-4 h-4 text-[#58cc02]" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* AI List Generator Modal */}
      {showAiGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-slate-700 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-amber-100">
                    Generate AI Word List
                  </h3>
                  <p className="text-xs text-slate-500">
                    Powered by Gemini 3.6 Flash
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiGeneratorModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAiList} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Topic / Origin / Focus Area:
                </label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., Latin root words, French cuisine terms..."
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick Preset Topic Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or pick a popular preset topic:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetTopics.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAiTopic(preset)}
                      className="text-xs px-2.5 py-1 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-slate-700 text-left"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Select */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Difficulty:
                  </label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 capitalize"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="championship">Championship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Word Count:
                  </label>
                  <select
                    value={aiWordCount}
                    onChange={(e) => setAiWordCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>5 Words</option>
                    <option value={8}>8 Words</option>
                    <option value={12}>12 Words</option>
                  </select>
                </div>
              </div>

              {generatorError && (
                <div className="p-3 bg-rose-100 text-rose-800 rounded-xl text-xs font-medium">
                  {generatorError}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || !aiTopic.trim()}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Generating Custom Word List...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Create Custom List with Gemini
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
