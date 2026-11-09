'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  FileEdit, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Sparkles,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Vacancy, ApplicationStatus } from '@/lib/types';

interface KanbanBoardProps {
  vacancies: Vacancy[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onOpenAI: (v: Vacancy) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; color: string; border: string }[] = [
  { id: 'applied', title: 'Отправлен отклик', color: 'bg-indigo-500/10 text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'viewed', title: 'Просмотрено HR', color: 'bg-violet-500/10 text-violet-400', border: 'border-violet-500/30' },
  { id: 'screening', title: 'Скрининг с HR', color: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'tech_interview', title: 'Технический собес', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'offer', title: 'Оффер 🎉', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
  { id: 'rejected', title: 'Отказ', color: 'bg-zinc-800 text-zinc-500', border: 'border-zinc-800' },
];

export function KanbanBoard({
  vacancies,
  onUpdateStatus,
  onUpdateNotes,
  onDelete,
  onOpenAI,
}: KanbanBoardProps) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const handleStartEditNotes = (v: Vacancy) => {
    setEditingNotesId(v.id);
    setNotesText(v.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, notesText);
    setEditingNotesId(null);
  };

  const moveNext = (v: Vacancy) => {
    const order: ApplicationStatus[] = ['applied', 'viewed', 'screening', 'tech_interview', 'offer'];
    const currentIndex = order.indexOf(v.status);
    if (currentIndex !== -1 && currentIndex < order.length - 1) {
      onUpdateStatus(v.id, order[currentIndex + 1]);
    }
  };

  const movePrev = (v: Vacancy) => {
    const order: ApplicationStatus[] = ['applied', 'viewed', 'screening', 'tech_interview', 'offer'];
    const currentIndex = order.indexOf(v.status);
    if (currentIndex > 0) {
      onUpdateStatus(v.id, order[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Board Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Канбан-доска откликов и собеседований</h2>
          <p className="text-xs text-zinc-400">Управляй статусами и заметками по каждому отклику</p>
        </div>
        <div className="text-xs text-zinc-400">
          Всего в работе: <span className="text-zinc-100 font-semibold">{vacancies.length} вакансий</span>
        </div>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {COLUMNS.map((col) => {
          const colVacancies = vacancies.filter((v) => v.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3 flex flex-col min-h-[420px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800/80">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs font-mono text-zinc-500 font-semibold">
                  {colVacancies.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colVacancies.length === 0 ? (
                  <div className="py-10 text-center text-xs text-zinc-600">Пусто</div>
                ) : (
                  colVacancies.map((v) => (
                    <div
                      key={v.id}
                      className="bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 rounded-xl p-3 transition-all space-y-2 text-xs group"
                    >
                      {/* Title & Company */}
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-zinc-100 leading-tight line-clamp-2">
                            {v.title}
                          </h4>
                          <button
                            onClick={() => onDelete(v.id)}
                            className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="Удалить из доски"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-zinc-400 text-[11px] block mt-0.5">{v.company}</span>
                      </div>

                      {/* Salary & Meta */}
                      {v.salary && (v.salary.from || v.salary.to) && (
                        <div className="text-emerald-400 font-medium text-[11px]">
                          {v.salary.from && v.salary.to
                            ? `${Math.round(v.salary.from / 1000)}k - ${Math.round(v.salary.to / 1000)}k ₽`
                            : v.salary.from
                            ? `от ${Math.round(v.salary.from / 1000)}k ₽`
                            : v.salary.to
                            ? `до ${Math.round(v.salary.to / 1000)}k ₽`
                            : null}
                        </div>
                      )}

                      {/* Account used */}
                      {v.accountUsed && (
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {v.accountUsed}
                        </div>
                      )}

                      {/* Notes Section */}
                      {editingNotesId === v.id ? (
                        <div className="space-y-1.5 pt-1">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            rows={2}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-[11px] text-zinc-200 focus:outline-none"
                            placeholder="Заметка (дата созвона, вопросы...)"
                          />
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200"
                            >
                              Отмена
                            </button>
                            <button
                              onClick={() => handleSaveNotes(v.id)}
                              className="px-2 py-0.5 bg-violet-600 text-white rounded text-[10px]"
                            >
                              Сохранить
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleStartEditNotes(v)}
                          className="bg-zinc-900/50 hover:bg-zinc-900 rounded p-1.5 text-[10px] text-zinc-400 cursor-pointer border border-zinc-800/60 leading-normal"
                        >
                          {v.notes ? v.notes : '+ Добавить заметку/дату'}
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => movePrev(v)}
                            title="Назад"
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveNext(v)}
                            title="Вперед"
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenAI(v)}
                            title="Сгенерировать AI-сопроводительное"
                            className="p-1 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
