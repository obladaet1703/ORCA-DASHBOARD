'use client';

import React, { useState } from 'react';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { 
  FileText, 
  Plus, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Briefcase,
  CheckCircle2,
  X
} from 'lucide-react';
import { ResumeProfile } from '@/lib/types';

export default function ResumesPage() {
  const { resumes, addResume, updateResume, deleteResume } = useApp();
  const [selectedId, setSelectedId] = useState<string>(resumes[0]?.id || '');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form states for Add/Edit
  const [formTitle, setFormTitle] = useState('');
  const [formSalary, setFormSalary] = useState(220000);
  const [formCategory, setFormCategory] = useState<'frontend' | 'fullstack' | 'backend'>('frontend');
  const [formSummary, setFormSummary] = useState('');
  const [formSkills, setFormSkills] = useState('');

  const currentResume = resumes.find((r) => r.id === selectedId) || resumes[0];

  const handleOpenEdit = (res: ResumeProfile) => {
    setFormTitle(res.title);
    setFormSalary(res.targetSalary);
    setFormCategory(res.category);
    setFormSummary(res.summary);
    setFormSkills(res.skills.join(', '));
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setFormTitle('Node.js Backend Developer');
    setFormSalary(230000);
    setFormCategory('backend');
    setFormSummary('Backend разработчик на Node.js, Fastify/NestJS, PostgreSQL. Опыт проектирования микросервисов, очередей и real-time сокетов.');
    setFormSkills('Node.js, TypeScript, PostgreSQL, Redis, Docker, Fastify, REST API, WebSockets');
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResume) return;
    updateResume(currentResume.id, {
      title: formTitle,
      targetSalary: Number(formSalary),
      category: formCategory,
      summary: formSummary,
      skills: formSkills.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setIsEditModalOpen(false);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addResume({
      title: formTitle,
      targetSalary: Number(formSalary),
      category: formCategory,
      currency: 'RUB',
      experienceYears: '3 года 7 месяцев',
      summary: formSummary,
      skills: formSkills.split(',').map((s) => s.trim()).filter(Boolean),
      bulletPoints: [
        {
          company: 'Коммерческий опыт',
          period: '2023 — 2026',
          role: formTitle,
          highlights: [
            'Разработка высоконагруженных серверных модулей и API.',
            'Оптимизация производительности и кэширования.',
          ],
        },
      ],
      active: true,
    });
    setIsAddModalOpen(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Мои Резюме" 
        subtitle="Управление профилями резюме, редактирование и быстрая синхронизация с hh.ru" 
      />

      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Selector Tabs & Add button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            {resumes.map((r) => {
              const isSelected = r.id === currentResume?.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm'
                      : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:bg-zinc-900'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-100' : 'text-zinc-500'}`} />
                  <span>{r.title}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            + Добавить новое резюме
          </button>
        </div>

        {currentResume && (
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-6 space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {currentResume.category.toUpperCase()} ПРОФИЛЬ
                </span>
                <h2 className="text-lg font-bold text-zinc-100 mt-2">{currentResume.title}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Опыт: {currentResume.experienceYears}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <span className="text-[10px] text-zinc-500 block">Желаемая З/П</span>
                  <span className="text-base font-bold text-emerald-400">
                    {currentResume.targetSalary.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <button
                  onClick={() => handleOpenEdit(currentResume)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Редактировать
                </button>

                {resumes.length > 1 && (
                  <button
                    onClick={() => deleteResume(currentResume.id)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Section: Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  О себе (Summary)
                </h3>
                <button
                  onClick={() => copyToClipboard(currentResume.summary, 'summary')}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1"
                >
                  {copiedKey === 'summary' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Копировать для hh</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-800/80">
                {currentResume.summary}
              </p>
            </div>

            {/* Section: Skills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Ключевые навыки
                </h3>
                <button
                  onClick={() => copyToClipboard(currentResume.skills.join(', '), 'skills')}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1"
                >
                  {copiedKey === 'skills' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Копировать теги</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentResume.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Section: Experience */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Опыт работы
              </h3>
              <div className="space-y-3">
                {currentResume.bulletPoints.map((b, i) => (
                  <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/60">
                      <div>
                        <span className="font-semibold text-zinc-100">{b.company}</span>
                        <span className="text-zinc-400 ml-2 font-mono text-[11px]">— {b.role}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">{b.period}</span>
                    </div>
                    <ul className="space-y-1 pt-1">
                      {b.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-zinc-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-zinc-500">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Редактировать резюме</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Название должности</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Желаемая З/П (₽)</label>
                <input
                  type="number"
                  required
                  value={formSalary}
                  onChange={(e) => setFormSalary(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">О себе (Summary)</label>
                <textarea
                  rows={3}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Навыки (через запятую)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Создать новое резюме</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Название должности</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Категория</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="backend">Backend (Node.js)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Желаемая З/П (₽)</label>
                  <input
                    type="number"
                    required
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">О себе (Summary)</label>
                <textarea
                  rows={3}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Навыки (через запятую)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
