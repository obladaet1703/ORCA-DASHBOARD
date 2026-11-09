'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Layers, 
  Search, 
  Kanban, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Bot
} from 'lucide-react';
import { HHAccount } from '@/lib/types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activePersona: 'frontend' | 'fullstack';
  setActivePersona: (persona: 'frontend' | 'fullstack') => void;
  accounts: HHAccount[];
  onBumpAll: () => Promise<void>;
  isBumping: boolean;
}

export function Header({
  activeTab,
  setActiveTab,
  activePersona,
  setActivePersona,
  accounts,
  onBumpAll,
  isBumping,
}: HeaderProps) {
  const [bumpSuccess, setBumpSuccess] = useState(false);

  const handleBump = async () => {
    await onBumpAll();
    setBumpSuccess(true);
    setTimeout(() => setBumpSuccess(false), 3000);
  };

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-zinc-100 tracking-tight">HUNT//ORCHESTRATOR</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                PRO v2.4
              </span>
            </div>
            <p className="text-xs text-zinc-400">Мульти-аккаунт хаб поиска работы • hh.ru, TG, Хабр</p>
          </div>
        </div>

        {/* Center: Accounts status indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-1.5 text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-800/50 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">HH Акк 1 (Фронт):</span>
            <span className="text-emerald-400 font-mono text-[11px]">Авто-ап через 1ч 48м</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-800/50 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium">HH Акк 2 (Фуллстек):</span>
            <span className="text-emerald-400 font-mono text-[11px]">Авто-ап через 10м</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Persona selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActivePersona('frontend')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activePersona === 'frontend'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Frontend Резюме
            </button>
            <button
              onClick={() => setActivePersona('fullstack')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activePersona === 'fullstack'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Fullstack Резюме
            </button>
          </div>

          {/* Quick bump button */}
          <button
            onClick={handleBump}
            disabled={isBumping}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg ${
              bumpSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-violet-500/50 shadow-black/40'
            }`}
          >
            {bumpSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                Все резюме подняты!
              </>
            ) : (
              <>
                <RefreshCw className={`w-3.5 h-3.5 ${isBumping ? 'animate-spin text-violet-400' : 'text-zinc-400'}`} />
                Поднять 2 резюме в топ
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-zinc-800/40 overflow-x-auto py-1">
        {[
          { id: 'dashboard', label: 'Воронка & Конверсии', icon: Layers },
          { id: 'vacancies', label: 'Агрегатор Вакансий', icon: Search, badge: 'Live' },
          { id: 'kanban', label: 'Канбан CRM', icon: Kanban, badge: '5 активных' },
          { id: 'resumes', label: 'Мои Резюме (2 персоны)', icon: FileText },
          { id: 'accounts', label: 'Оркестратор HH (2 аккаунта)', icon: Users, badge: '2 активны' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-800/90 text-zinc-100 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
              {tab.label}
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
