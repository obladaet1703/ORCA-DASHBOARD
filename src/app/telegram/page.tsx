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
  MessageSquare,
  Copy,
  Check
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
        subtitle="Мониторинг 6 целевых каналов по фронтенду с мгновенным AI-откликом" 
      />

      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Channel Selector Pills */}
        <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-1">
            Выбери канал для просмотра:
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

        {/* Channel Info Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-100">{selectedChannel.name}</h2>
              <span className="text-xs text-zinc-500 font-mono">
                {selectedChannel.isPrivate ? selectedChannel.inviteLink : `t.me/${selectedChannel.username}`}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Категория: {selectedChannel.category}</p>
          </div>

          <div className="flex items-center gap-2">
            {!selectedChannel.isPrivate && (
              <button
                onClick={() => fetchChannelVacancies(selectedChannel.username)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Обновить ленту
              </button>
            )}

            <a
              href={selectedChannel.isPrivate ? selectedChannel.inviteLink : `https://t.me/${selectedChannel.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
            >
              <span>Открыть в Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Content */}
        {selectedChannel.isPrivate ? (
          <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-8 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-200">Приватный канал по инвайт-ссылке</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Этот канал закрыт для публичного предпросмотра веб-парсером. Переходи по инвайт-ссылке напрямую в клиент Telegram для просмотра новых постов.
            </p>
            <a
              href={selectedChannel.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors mt-2"
            >
              Вступить в канал по ссылке
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <RefreshCw className="w-7 h-7 animate-spin text-zinc-400" />
            <p className="text-xs">Считываю свежие посты из @{selectedChannel.username}...</p>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-8 text-center text-zinc-500 text-xs">
            Нет свежих постов или канал временно недоступен. Нажми «Обновить ленту».
          </div>
        ) : (
          <div className="space-y-3">
            {vacancies.map((v) => {
              const isSaved = savedIds.has(v.id);
              return (
                <div
                  key={v.id}
                  className="border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-xl p-5 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          @{selectedChannel.username}
                        </span>
                        <h3 className="font-semibold text-sm text-zinc-100">{v.title}</h3>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        {v.salary && (
                          <span className="text-emerald-400 font-medium">
                            {v.salary.from && `${v.salary.from.toLocaleString('ru-RU')} ₽`}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(v.publishedAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed pt-1 font-sans">
                        {v.descriptionSnippet}
                      </p>

                      {v.tags && v.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {v.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSaved
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
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
                            Сохранить в Канбан
                          </>
                        )}
                      </button>

                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 pt-1"
                      >
                        <span>Пост в Telegram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
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
