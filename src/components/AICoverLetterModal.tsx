'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, X, RefreshCw, Send } from 'lucide-react';
import { Vacancy } from '@/lib/types';

interface AICoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: Vacancy | null;
  activeProfileType: 'frontend' | 'fullstack';
}

export function AICoverLetterModal({
  isOpen,
  onClose,
  vacancy,
  activeProfileType,
}: AICoverLetterModalProps) {
  const [profileType, setProfileType] = useState<'frontend' | 'fullstack'>(activeProfileType);
  const [letter, setLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProfileType(activeProfileType);
  }, [activeProfileType]);

  useEffect(() => {
    if (isOpen && vacancy) {
      generateLetter(profileType);
    }
  }, [isOpen, vacancy]);

  const generateLetter = async (selectedType: 'frontend' | 'fullstack') => {
    if (!vacancy) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacancyTitle: vacancy.title,
          company: vacancy.company,
          description: vacancy.descriptionSnippet,
          profileType: selectedType,
          keyRequirements: vacancy.tags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLetter(data.letter);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !vacancy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100 text-lg">AI Сопроводительное письмо</h3>
              <p className="text-xs text-zinc-400 truncate max-w-md">
                {vacancy.title} • {vacancy.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona toggle */}
        <div className="p-4 bg-zinc-900/30 border-b border-zinc-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Позиционирование:</span>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              <button
                onClick={() => {
                  setProfileType('frontend');
                  generateLetter('frontend');
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  profileType === 'frontend'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Frontend Специалист
              </button>
              <button
                onClick={() => {
                  setProfileType('fullstack');
                  generateLetter('fullstack');
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  profileType === 'fullstack'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Fullstack Инженер
              </button>
            </div>
          </div>

          <button
            onClick={() => generateLetter(profileType)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Перегенерировать
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
              <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
              <p className="text-sm">Анализирую требования вакансии и опыт в резюме...</p>
            </div>
          ) : (
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={12}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 leading-relaxed font-sans focus:outline-none focus:border-violet-500/50 resize-none"
              placeholder="Текст сопроводительного..."
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Готово для отправки на {vacancy.source === 'telegram' ? 'в личку Telegram' : 'hh.ru / Хабр'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-medium transition-colors border border-zinc-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Копировать текст
                </>
              )}
            </button>
            <a
              href={vacancy.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-violet-600/20"
            >
              <Send className="w-4 h-4" />
              Открыть вакансию и откликнуться
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
