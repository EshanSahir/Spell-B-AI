import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, User, Bot, HelpCircle } from 'lucide-react';
import { AICoachMessage } from '../types';

export const AICoachChat: React.FC = () => {
  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am your AI Spelling Bee Champion Coach. 🐝\n\nAsk me about classical roots (Latin, Greek, French, German), spelling rules (e.g. -able vs -ible, silent letters, double consonants), or mnemonics to remember tricky words!",
      timestamp: Date.now(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userMsg: AICoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputQuery.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json();
      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Failed to get coach response');
      }

      const botMsg: AICoachMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Coach chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Apologies! I encountered an issue connecting to the AI Coach server. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What is the rule for -able vs -ible endings?',
    'Why is "pharaoh" spelled with A before O?',
    'How do I identify French loanwords with silent final letters?',
    'What are the most common Greek root words in spelling bees?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#161c28] text-slate-800 dark:text-slate-100 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-[#58cc02] text-white flex items-center justify-center font-black text-2xl border-b-4 border-[#46a302] flex-shrink-0">
          🦉
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            Duo Spelling Bee Coach
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-[#1cb0f6] border border-sky-200 dark:border-sky-800 uppercase tracking-wider">
              Gemini AI
            </span>
          </h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Etymological guidance, root origin rules, and mnemonics for championship competition.
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
          Prompts:
        </span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => setInputQuery(q)}
            className="text-xs font-extrabold px-3.5 py-2 bg-white dark:bg-[#161c28] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl border-2 border-slate-200 dark:border-slate-800 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-[#161c28] rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 h-[450px] overflow-y-auto space-y-4 shadow-inner transition-colors">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 border-b-2 ${
                m.sender === 'user'
                  ? 'bg-[#1cb0f6] border-[#1899d6] text-white'
                  : 'bg-[#58cc02] border-[#46a302] text-white'
              }`}
            >
              {m.sender === 'user' ? '👤' : '🦉'}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-[#1cb0f6] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-sans'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#58cc02] text-white flex items-center justify-center border-b-2 border-[#46a302]">
              🦉
            </div>
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#1cb0f6]" />
              Duo Coach is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Duo about spelling rules, roots, or mnemonics..."
          className="flex-1 px-5 py-3.5 text-xs font-bold bg-white dark:bg-[#161c28] text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-[#1cb0f6] placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-6 py-3.5 bg-[#58cc02] hover:bg-[#61e002] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:border-slate-300 dark:disabled:border-slate-700 disabled:text-slate-400 dark:disabled:text-slate-600 border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>

    </div>
  );
};
