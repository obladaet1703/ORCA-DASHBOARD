'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  PlusCircle, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  RefreshCw,
  Send,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Vacancy, PlatformSource } from '@/lib/types';
import { AICoverLetterModal } from './AICoverLetterModal';

interface VacancyFeedProps {
  onAddToKanban: (vacancy: Vacancy) => void;
  activePersona: 'frontend' | 'fullstack';
}

export function VacancyFeed({ onAddToKanban, activePersona }: VacancyFeedProps) {
  const [source, setSource] = useState<PlatformSource | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('React TypeScript');
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVacancyForAI, setSelectedVacancyForAI] = useState<Vacancy | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Загрузка вакансий
  const fetchVacancies = async () => {
    setLoading(true);
    const results: Vacancy[] = [];

    try {
      // 1. Если выбран hh.ru или все
      if (source === 'all' || source === 'hh') {
        const hhRes = await fetch(`/api/vacancies/hh?text=${encodeURIComponent(searchQuery)}&remote=${remoteOnly}`);
        const hhData = await hhRes.json();
        if (hhData.success && hhData.vacancies) {
          results.push(...hhData.vacancies);
        }
      }

      // 2. Если выбран Telegram или все
      if (source === 'all' || source === 'telegram') {
        const tgRes = await fetch(`/api/vacancies/telegram?channel=forwebdev`);
        const tgData = await tgRes.json();
        if (tgData.success && tgData.vacancies) {
          results.push(...tgData.vacancies);
        }
      }

      // 3. Если выбран Habr или все
      if (source === 'all' || source === 'habr') {
        const habrRes = await fetch(`/api/vacancies/habr?q=${encodeURIComponent(searchQuery)}`);
        const habrData = await habrRes.json();
        if (habrData.success && habrData.vacancies) {
          results.push(...habrData.vacancies);
        }
      }

      setVacancies(results);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [source, remoteOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVacancies();
  };

  const handleAdd = (v: Vacancy) => {
    onAddToKanban(v);
    setSavedIds((prev) => new Set(prev).add(v.id));
  };

  const formatSalary = (salary: Vacancy['salary']) => {
    if (!salary || (!salary.from && !salary.to)) return 'По договорённости';
    const currency = salary.currency === 'RUR' ? '₽' : salary.currency === 'USD' ? '$' : salary.currency;
    if (salary.from && salary.to) {
      return `${salary.from.toLocaleString('ru-RU')} — ${salary.to.toLocaleString('ru-RU')} ${currency}`;
    }
    if (salary.from) return `от ${salary.from.toLocaleString('ru-RU')} ${currency}`;
    if (salary.to) return `до ${salary.to.toLocaleString('ru-RU')} ${currency}`;
    return 'По договорённости';
  };

  const getSourceBadge = (src: PlatformSource) => {
    switch (src) {
      case 'hh':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">hh.ru</span>;
      case 'telegram':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">Telegram</span>;
      case 'habr':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">Хабр Карьера</span>;
      case 'getmatch':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Getmatch</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ключевые слова: React, Next.js, TypeScript, Node.js..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Найти вакансии
          </button>
        </form>

        {/* Source Pills & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium text-[11px]">Источники:</span>
            <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              {[
                { id: 'all', label: 'Все каналы' },
                { id: 'hh', label: 'hh.ru' },
                { id: 'telegram', label: 'Telegram' },
                { id: 'habr', label: 'Хабр' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id as any)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    source === s.id
                      ? 'bg-zinc-800 text-zinc-100 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-violet-600 focus:ring-0"
              />
              <span>Только Удаленка</span>
            </label>
          </div>
        </div>
      </div>

      {/* Feed Results */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
          <p className="text-sm font-medium">Опрашиваю hh.ru API, каналы Telegram и Хабр Карьеру...</p>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl">
          <Search className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
          <p className="text-sm">По заданным фильтрам вакансий не найдено.</p>
          <button
            onClick={() => {
              setSearchQuery('frontend');
              fetchVacancies();
            }}
            className="mt-3 text-xs text-violet-400 hover:underline"
          >
            Сбросить на поиск «frontend»
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {vacancies.map((v) => {
            const isSaved = savedIds.has(v.id);
            return (
              <div
                key={v.id}
                className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-5 transition-all shadow-sm group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {getSourceBadge(v.source)}
                      <h3 className="font-semibold text-zinc-100 text-base group-hover:text-violet-300 transition-colors">
                        {v.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                        {v.company}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        {formatSalary(v.salary)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {v.location || 'РФ'}
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(v.publishedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>

                    {/* Description snippet */}
                    {v.descriptionSnippet && (
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                        {v.descriptionSnippet}
                      </p>
                    )}

                    {/* Tags */}
                    {v.tags && v.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {v.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedVacancyForAI(v)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-violet-600/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Сопроводительное
                    </button>

                    <button
                      onClick={() => handleAdd(v)}
                      disabled={isSaved}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                        isSaved
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          В Канбане
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          В Канбан
                        </>
                      )}
                    </button>

                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 pt-1"
                    >
                      <span>Открыть</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Modal */}
      <AICoverLetterModal
        isOpen={!!selectedVacancyForAI}
        onClose={() => setSelectedVacancyForAI(null)}
        vacancy={selectedVacancyForAI}
        activeProfileType={activePersona}
      />
    </div>
  );
}
