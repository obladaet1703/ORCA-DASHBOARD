'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Briefcase, 
  Code, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { INITIAL_RESUME_PROFILES } from '@/lib/mock-data';
import { ResumeProfile } from '@/lib/types';

export function ResumePersonaManager() {
  const [selectedPersona, setSelectedPersona] = useState<string>('res-frontend');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const profile = INITIAL_RESUME_PROFILES.find((p) => p.id === selectedPersona) || INITIAL_RESUME_PROFILES[0];

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const generateFullHHText = (p: ResumeProfile) => {
    let text = `${p.title}\n`;
    text += `Желаемая зарплата: ${p.targetSalary.toLocaleString('ru-RU')} ${p.currency}\n\n`;
    text += `О СЕБЕ:\n${p.summary}\n\n`;
    text += `КЛЮЧЕВЫЕ НАВЫКИ:\n${p.skills.join(', ')}\n\n`;
    text += `ОПЫТ РАБОТЫ:\n`;
    p.bulletPoints.forEach((b) => {
      text += `\n${b.company} (${b.period})\nДолжность: ${b.role}\n`;
      b.highlights.forEach((h) => {
        text += `• ${h}\n`;
      });
    });
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Header & Persona Selector */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            Оптимизированные Резюме (2 целевых профиля)
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Сфокусированы под фильтры HR и ATS. Слово «Intern» заменено на продуктовый опыт в AI & Search, добавлены метрики и убрана лишняя информация.
          </p>
        </div>

        {/* Persona toggle */}
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
          {INITIAL_RESUME_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPersona === p.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {p.category === 'frontend' ? '1. Frontend Резюме' : '2. Fullstack Резюме'}
            </button>
          ))}
        </div>
      </div>

      {/* Difference / Improvements Highlight Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Исправлено позиционирование в Яндексе
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Вместо «Intern (Стажёр)» теперь указан «Frontend-разработчик команды AI & Search». HR больше не бракует резюме в первые 3 секунды.
          </p>
        </div>

        <div className="bg-violet-950/20 border border-violet-800/40 rounded-xl p-3.5">
          <div className="flex items-center gap-2 text-violet-400 font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            Усилены технические метрики
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Подсвечены chunked upload, AbortController, сокращение нагрузки на бэкенд на 35% и оптимизация расходов CI на 60%.
          </p>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl p-3.5">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Briefcase className="w-4 h-4" />
            Убран информационный шум
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Убрана отметка «Медкнижка: есть» и размытые формулировки. Резюме готово к автоматическому ранжированию в топ выдачи hh.ru.
          </p>
        </div>
      </div>

      {/* Detailed Resume Preview Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
        {/* Title & Desired Salary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
              Целевая должность на hh.ru
            </span>
            <h3 className="text-lg font-bold text-zinc-100 mt-1">{profile.title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Опыт разработки: {profile.experienceYears}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block">Желаемая З/П</span>
              <span className="text-lg font-bold text-emerald-400">
                {profile.targetSalary.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <button
              onClick={() => handleCopyText(generateFullHHText(profile), 'all')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-medium border border-zinc-700 transition-colors"
            >
              {copiedSection === 'all' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Скопировано всё резюме!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Копировать для hh.ru
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">О себе</h4>
            <button
              onClick={() => handleCopyText(profile.summary, 'summary')}
              className="text-[11px] text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
            >
              {copiedSection === 'summary' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              Копировать блок
            </button>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80">
            {profile.summary}
          </p>
        </div>

        {/* Skills block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Ключевые навыки</h4>
            <button
              onClick={() => handleCopyText(profile.skills.join(', '), 'skills')}
              className="text-[11px] text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
            >
              {copiedSection === 'skills' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              Копировать теги
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience details */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Опыт работы (3 года 7 месяцев)</h4>
          <div className="space-y-4">
            {profile.bulletPoints.map((b, i) => (
              <div key={i} className="bg-zinc-950/60 border border-zinc-800/90 rounded-xl p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-zinc-800/60">
                  <div>
                    <h5 className="font-semibold text-zinc-100 text-sm">{b.company}</h5>
                    <span className="text-xs text-violet-300 font-medium">{b.role}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">{b.period}</span>
                </div>

                <ul className="space-y-1.5 pt-1">
                  {b.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-violet-400 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
