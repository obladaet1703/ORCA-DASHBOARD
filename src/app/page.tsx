'use client';

import React from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { 
  Building2, 
  Send, 
  FileText, 
  ArrowUpRight, 
  Eye, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Layers,
  Sparkles,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';

// Кастомный высококонтрастный тултип в стиле shadcn
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700/80 px-3.5 py-2.5 rounded-xl shadow-2xl space-y-1 z-50">
        <div className="text-xs font-semibold text-zinc-100">{label}</div>
        <div className="text-sm font-bold text-emerald-400">
          {data.count} <span className="text-xs font-normal text-zinc-400">кандидатур ({data.rate})</span>
        </div>
        <div className="text-[10px] text-zinc-500 pt-0.5 border-t border-zinc-800">
          {data.hint}
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const { accounts, resumes, channels, applications } = useApp();

  const totalApplied = accounts.reduce(
    (sum, acc) => sum + (acc.resumes[0]?.appliedCount || acc.negotiations?.length || 0), 
    0
  );

  const totalImpressions = accounts.reduce(
    (sum, acc) => sum + acc.resumes.reduce((s, r) => s + (r.impressionsCount || 0), 0), 
    0
  );

  const totalViews = accounts.reduce(
    (sum, acc) => sum + acc.resumes.reduce((s, r) => s + (r.viewsCount || 0), 0), 
    0
  );

  const totalInvitations = accounts.reduce(
    (sum, acc) => sum + acc.resumes.reduce((s, r) => s + (r.invitationsCount || 0), 0), 
    0
  );

  const funnelData = [
    { 
      name: 'Отклики', 
      count: totalApplied, 
      rate: '100%', 
      hint: 'Отправлено резюме на вакансии работодателей', 
      fill: '#818cf8' 
    },
    { 
      name: 'Показы в поиске', 
      count: totalImpressions, 
      rate: `${totalImpressions} раз`, 
      hint: 'Появилось в выдаче у рекрутеров за неделю', 
      fill: '#f4f4f5' 
    },
    { 
      name: 'Просмотры HR', 
      count: totalViews, 
      rate: totalApplied > 0 ? `${Math.round((totalViews / totalApplied) * 100)}%` : (totalImpressions > 0 ? `${Math.round((totalViews / totalImpressions) * 100)}%` : '0%'), 
      hint: 'Рекрутеры открыли и изучили резюме (из откликов и поиска)', 
      fill: '#a78bfa' 
    },
    { 
      name: 'Приглашения', 
      count: totalInvitations, 
      rate: totalViews > 0 ? `${Math.round((totalInvitations / totalViews) * 100)}%` : '0%', 
      hint: 'Приглашения на интервью / скрининг', 
      fill: '#34d399' 
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Обзор портала" 
        subtitle="Единая точка управления поиском: hh.ru, Telegram каналы и резюме" 
      />

      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Отправлено откликов</span>
              <Send className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalApplied}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {totalApplied > 0 ? `${totalApplied} в работе` : 'Ожидает синхронизации'}
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Показы в поиске</span>
              <Search className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalImpressions}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              За последние 7 дней
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Просмотры HR</span>
              <Eye className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalViews}</div>
            <div className="text-[11px] text-violet-400 mt-1 font-medium">
              {totalApplied > 0 
                ? `Конверсия откликов: ${Math.round((totalViews / totalApplied) * 100)}%` 
                : `Клик в поиске: ${totalImpressions > 0 ? Math.round((totalViews / totalImpressions) * 100) : 0}%`}
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">Приглашения</span>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalInvitations}</div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {totalInvitations === 0 ? 'Требуется смена позиционирования' : `${totalInvitations} активных`}
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
                    <p className="text-[11px] text-zinc-500">Оркестрация аккаунтов и авто-поднятие</p>
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
              <span className="text-zinc-500">Авто-поднятие активно</span>
              <Link
                href="/hh"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium border border-zinc-800"
              >
                Управление аккаунтами →
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
                    <p className="text-[11px] text-zinc-500">6 целевых каналов со свежими вакансиями</p>
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
              <span className="text-zinc-500">Сортировка от новых к старым</span>
              <Link
                href="/telegram"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium border border-zinc-800"
              >
                Читать посты в каналах →
              </Link>
            </div>
          </div>
        </div>

        {/* Clear, High-Contrast Conversion Funnel Chart */}
        <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-400" />
                Воронка конверсии откликов
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Наведи курсор на любой столбец для просмотра подробной статистики и процента прохождения
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-100" /> Отклики (48)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" /> Просмотры (34)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Скрининги (7)
              </span>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#a1a1aa" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#27272a' }}
                />
                <Tooltip 
                  content={<CustomChartTooltip />} 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
