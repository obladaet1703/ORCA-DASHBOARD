'use client';

import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { 
  Send, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  RefreshCw, 
  DollarSign, 
  MapPin, 
  Clock, 
  Lock,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { Vacancy } from '@/lib/types';
import { AICoverLetterModal } from '@/components/AICoverLetterModal';

export default function TelegramPage() {
  const { channels, addApplication } = useApp();
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedVacancyForAI, setSelectedVacancyForAI] = useState<Vacancy | null>(null);

  // Expanded post IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchChannelVacancies = async (channelUsername: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vacancies/telegram?channel=${channelUsername}`);
      const data = await res.json();
      if (data.success && data.vacancies) {
        setVacancies(data.vacancies);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChannel.isPrivate) {
      fetchChannelVacancies(selectedChannel.username);
    } else {
      setVacancies([]);
    }
  }, [selectedChannel]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSaveToKanban = (v: Vacancy) => {
    addApplication({
      ...v,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Отклик отправлен из Telegram канала @${selectedChannel.username}`,
    });
    setSavedIds((prev) => new Set(prev).add(v.id));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Telegram Каналы" 
        subtitle="Мониторинг 6 целевых каналов по фронтенду (от самых свежих постов)" 
      />

      <main className="p-6 max-w-5xl w-full mx-auto space-y-6">
        {/* Channel Selector Pills */}
        <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-1">
            Выбери канал:
          </div>
          <div className="flex flex-wrap gap-2">
            {channels.map((ch) => {
              const isSelected = ch.id === selectedChannel.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:bg-zinc-900'
                  }`}
                >
                  {ch.isPrivate ? (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span>{ch.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {ch.isPrivate ? 'приватный' : `@${ch.username}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Channel Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-100">{selectedChannel.name}</h2>
              <span className="text-xs text-zinc-500 font-mono">
                {selectedChannel.isPrivate ? selectedChannel.inviteLink : `t.me/${selectedChannel.username}`}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Сортировка: <strong className="text-zinc-200">Сначала самые новые</strong> • {vacancies.length} постов
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!selectedChannel.isPrivate && (
              <button
                onClick={() => fetchChannelVacancies(selectedChannel.username)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Обновить
              </button>
            )}

            <a
              href={selectedChannel.isPrivate ? selectedChannel.inviteLink : `https://t.me/${selectedChannel.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
            >
              <span>В Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Posts Content */}
        {selectedChannel.isPrivate ? (
          <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-8 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-200">Приватный канал по инвайт-ссылке</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Этот канал закрыт для парсинга веб-зеркалом Telegram. Вступай в канал напрямую через инвайт-ссылку.
            </p>
            <a
              href={selectedChannel.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors mt-2"
            >
              Вступить в закрытый канал
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <RefreshCw className="w-7 h-7 animate-spin text-zinc-400" />
            <p className="text-xs">Считываю самые свежие посты из @{selectedChannel.username}...</p>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-8 text-center text-zinc-500 text-xs">
            Нет доступных постов. Нажми «Обновить».
          </div>
        ) : (
          <div className="space-y-4">
            {vacancies.map((v, idx) => {
              const isSaved = savedIds.has(v.id);
              const isExpanded = expandedIds.has(v.id);
              const isLongText = v.descriptionSnippet.length > 500;
              const formattedDate = new Date(v.publishedAt).toLocaleString('ru-RU', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <article
                  key={v.id}
                  className="border border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 rounded-xl p-5 transition-all space-y-3"
                >
                  {/* Top Bar: Channel & Timestamp */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                        @{selectedChannel.username}
                      </span>
                      {idx === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          САМЫЙ СВЕЖИЙ
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-sm text-zinc-100">{v.title}</h3>
                      {v.salary && (v.salary.from || v.salary.to) && (
                        <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>
                            {v.salary.from && v.salary.to
                              ? `${v.salary.from.toLocaleString('ru-RU')} — ${v.salary.to.toLocaleString('ru-RU')} ₽`
                              : v.salary.from
                              ? `от ${v.salary.from.toLocaleString('ru-RU')} ₽`
                              : v.salary.to
                              ? `до ${v.salary.to.toLocaleString('ru-RU')} ₽`
                              : null}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedVacancyForAI(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                        AI Сопроводительное
                      </button>

                      <button
                        onClick={() => handleSaveToKanban(v)}
                        disabled={isSaved}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSaved
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Сохранено' : 'В Канбан'}</span>
                      </button>

                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                        title="Открыть оригинальный пост в Telegram"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* FULL Post Body */}
                  <div className="pt-2">
                    <div
                      className={`text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-sans bg-zinc-900/30 p-4 rounded-lg border border-zinc-800/80 ${
                        !isExpanded && isLongText ? 'max-h-56 overflow-hidden relative' : ''
                      }`}
                    >
                      {v.descriptionSnippet}
                      {!isExpanded && isLongText && (
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {isLongText && (
                      <button
                        onClick={() => toggleExpand(v.id)}
                        className="mt-2 text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1 font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Свернуть текст
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            Читать пост полностью ({v.descriptionSnippet.length} символов)
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  {v.tags && v.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {v.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <AICoverLetterModal
        isOpen={!!selectedVacancyForAI}
        onClose={() => setSelectedVacancyForAI(null)}
        vacancy={selectedVacancyForAI}
        activeProfileType="frontend"
      />
    </div>
  );
}
