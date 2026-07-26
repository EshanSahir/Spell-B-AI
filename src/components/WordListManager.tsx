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
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/15 border border-slate-950/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered List Generator
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Explore & Create Spelling Bee Lists
          </h2>
          <p className="text-sm font-medium opacity-90 max-w-xl">
            Choose from curated competition word sets or generate custom AI lists tailored to any origin, topic, or difficulty tier.
          </p>
        </div>

        <button
          onClick={() => setShowAiGeneratorModal(true)}
          className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
        >
          <Wand2 className="w-5 h-5 text-amber-400" />
          Generate AI Word List
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              filterDifficulty === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100'
            }`}
          >
            All Difficulty Levels
          </button>
          {(['beginner', 'intermediate', 'advanced', 'championship'] as DifficultyLevel[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all capitalize whitespace-nowrap ${
                filterDifficulty === diff
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words or topics..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-500"
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
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-amber-50/90 dark:bg-slate-900 border-2 border-amber-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-slate-800 hover:border-amber-400 shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${getDifficultyBadgeColor(list.difficulty)}`}>
                    {list.difficulty}
                  </span>
                  {list.isCustom && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" /> AI Generated
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-amber-100">
                  {list.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {list.description}
                </p>
              </div>

              {/* Sample words preview */}
              <div className="space-y-1.5 pt-2 border-t border-amber-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contains {list.words.length} Words, e.g.:
                </span>
                <div className="flex flex-wrap gap-1">
                  {list.words.slice(0, 4).map((w) => (
                    <span key={w.id} className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700">
                      {w.word}
                    </span>
                  ))}
                  {list.words.length > 4 && (
                    <span className="text-xs text-slate-400 self-center">
                      +{list.words.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectWordList(list)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-900 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white dark:text-amber-100'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" /> Currently Active List
                  </>
                ) : (
                  <>
                    Practice This List
                    <ArrowRight className="w-4 h-4" />
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
