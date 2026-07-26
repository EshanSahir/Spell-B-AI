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
      <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-amber-100 p-6 rounded-3xl border border-amber-800/50 shadow-md flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            AI Spelling Bee Champion Coach
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Gemini 3.6 Flash
            </span>
          </h2>
          <p className="text-xs text-amber-200/80">
            Ask any question about root origins, pronunciation quirks, rules, or mnemonics.
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Quick Prompts:
        </span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => setInputQuery(q)}
            className="text-xs px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-amber-200/80 dark:border-slate-800 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/80 dark:border-slate-800 p-6 h-[450px] overflow-y-auto space-y-4 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-amber-400 border border-amber-500/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              Coach is analyzing spelling rules...
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
          placeholder="Ask a question about spelling rules, roots, or mnemonics..."
          className="flex-1 px-5 py-3.5 text-sm bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-amber-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>

    </div>
  );
};
