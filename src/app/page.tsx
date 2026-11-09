'use client';

import React from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { 
  Building2, 
  Send, 
  FileText, 
  Kanban, 
  ArrowUpRight, 
  Eye, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function DashboardPage() {
  const { accounts, resumes, channels, applications } = useApp();

  const totalViews = accounts.reduce(
    (sum, acc) => sum + acc.resumes.reduce((s, r) => s + (r.viewsCount || 0), 0), 
    0
  );

  const funnelData = [
    { name: 'Отклики', count: 48 },
    { name: 'Просмотры', count: 34 },
    { name: 'Скрининги', count: 7 },
    { name: 'Техсобесы', count: 2 },
    { name: 'Офферы', count: 0 },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Обзор портала" 
        subtitle="Единая точка управления поиском: hh.ru, Telegram каналы и резюме" 
      />

      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* KPI Grid in strict shadcn style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Аккаунты hh.ru</span>
              <Building2 className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{accounts.length}</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Оркестратор активен
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Просмотры HR</span>
              <Eye className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalViews}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Конверсия: <strong className="text-zinc-200">70.8%</strong>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Telegram Каналы</span>
              <Send className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{channels.length}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              5 открытых + 1 приватный
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Версии Резюме</span>
              <FileText className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{resumes.length}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Frontend / Fullstack
            </div>
          </div>
        </div>

        {/* Portal Two Main Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1: Наш hh.ru */}
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-100">Наш hh.ru Портал</h3>
                    <p className="text-[11px] text-zinc-500">Оркестрация 2 аккаунтов и авто-поднятие</p>
                  </div>
                </div>
                <Link
                  href="/hh"
                  className="text-xs font-medium text-zinc-300 hover:text-zinc-100 inline-flex items-center gap-1"
                >
                  Открыть <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5 mt-4">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-zinc-200">{acc.name}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono block mt-0.5">{acc.accountEmail}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">Авто-ап 4ч</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Синхронизация активна</span>
              <Link
                href="/hh"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium border border-zinc-800"
              >
                Управление аккаунтами и резюме →
              </Link>
            </div>
          </div>

          {/* Pillar 2: Telegram Hub */}
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
                    <Send className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-100">Telegram Каналы</h3>
                    <p className="text-[11px] text-zinc-500">6 целевых каналов с AI-откликами</p>
                  </div>
                </div>
                <Link
                  href="/telegram"
                  className="text-xs font-medium text-zinc-300 hover:text-zinc-100 inline-flex items-center gap-1"
                >
                  Лента <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {channels.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between"
                  >
                    <div className="truncate">
                      <span className="font-medium text-zinc-200 block truncate">{ch.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono truncate">
                        {ch.isPrivate ? 'инвайт' : `@${ch.username}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500">AI-генератор сопроводительных</span>
              <Link
                href="/telegram"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium border border-zinc-800"
              >
                Смотреть вакансии в каналах →
              </Link>
            </div>
          </div>
        </div>

        {/* Minimalist Conversion Funnel */}
        <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Воронка конверсии</h3>
              <p className="text-xs text-zinc-500">Отслеживание прохождения этапов</p>
            </div>
            <Link href="/kanban" className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1">
              Канбан доска <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3f3f46" radius={[4, 4, 0, 0]} activeBar={{ fill: '#d4d4d8' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
