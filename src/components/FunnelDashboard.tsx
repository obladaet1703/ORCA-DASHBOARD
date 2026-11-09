'use client';

import React from 'react';
import { 
  TrendingUp, 
  Eye, 
  Send, 
  PhoneCall, 
  Code2, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export function FunnelDashboard() {
  // Данные воронки конверсий
  const funnelData = [
    { stage: 'Отклики', count: 48, percentage: '100%', fill: '#6366f1' },
    { stage: 'Просмотры', count: 34, percentage: '70.8%', fill: '#8b5cf6' },
    { stage: 'Скрининг HR', count: 7, percentage: '14.5%', fill: '#06b6d4' },
    { stage: 'Техсоб', count: 2, percentage: '4.1%', fill: '#10b981' },
    { stage: 'Оффер', count: 0, percentage: '0%', fill: '#f59e0b' },
  ];

  // Данные динамики откликов по дням
  const activityData = [
    { day: 'Пн', отклики: 8, просмотры: 6 },
    { day: 'Вт', отклики: 11, просмотры: 9 },
    { day: 'Ср', отклики: 7, просмотры: 5 },
    { day: 'Чт', отклики: 9, просмотры: 6 },
    { day: 'Пт', отклики: 6, просмотры: 5 },
    { day: 'Сб', отклики: 3, просмотры: 2 },
    { day: 'Вс', отклики: 4, просмотры: 1 },
  ];

  // A/B тест резюме: Фронтенд против Фуллстека
  const personaComparison = [
    {
      name: 'Frontend Engineer (React/Next)',
      applications: 32,
      views: 24,
      viewRate: '75%',
      interviews: 5,
      interviewRate: '15.6%',
      status: 'Выше конверсия в просмотр',
      color: 'border-violet-500/30 bg-violet-500/5',
    },
    {
      name: 'Fullstack (Node.js/React)',
      applications: 16,
      views: 10,
      viewRate: '62.5%',
      interviews: 2,
      interviewRate: '12.5%',
      status: 'Выше вилка по з/п (+15-20%)',
      color: 'border-cyan-500/30 bg-cyan-500/5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Insight */}
      <div className="bg-gradient-to-r from-violet-950/60 via-zinc-900/60 to-zinc-950 border border-violet-800/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              Аналитика Воронки: Главные точки роста на этой неделе
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Конверсия в просмотр держится на уровне <strong>70.8%</strong>. После оптимизации заголовка (удаление пометки «Intern») прогнозируется выход на <strong>3-4 скрининга в неделю</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-center">
          <span className="text-xs text-zinc-400">Цель:</span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            200K+ ₽ Оффер
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Отправлено</span>
            <Send className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">48</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            +14 за 7 дней
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Просмотры</span>
            <Eye className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">34</div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Конверсия: <span className="text-violet-400 font-semibold">70.8%</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Скрининги HR</span>
            <PhoneCall className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">7</div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Конверсия: <span className="text-cyan-400 font-semibold">14.5%</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Техсобесы</span>
            <Code2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">2</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            Mindbox (ср, 16:00)
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Офферы</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">0</div>
          <div className="text-[11px] text-amber-400 mt-1">
            В активной фазе
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Dropoff Chart */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-zinc-100 text-sm">Воронка конверсии этапов</h3>
              <p className="text-xs text-zinc-400">Где кандидаты проходят или отсеиваются</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
              Все каналы суммарно
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#71717a" fontSize={12} />
                <YAxis dataKey="stage" type="category" stroke="#a1a1aa" fontSize={12} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any, name: any, item: any) => [`${value} кандидатур (${item.payload.percentage})`, 'Количество']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick takeaway */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Вывод:</strong> Отклик → Просмотр конвертируется отлично (70%). Узкое горлышко было на переходе Просмотр → Скрининг (исправляем удалением слова Intern).
            </span>
          </div>
        </div>

        {/* Weekly Activity Line Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-zinc-100 text-sm">Активность откликов</h3>
              <BarChart3 className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-xs text-zinc-400 mb-4">Количество откликов и просмотров по дням</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="отклики" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="просмотры" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Отклики
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Просмотры
            </span>
          </div>
        </div>
      </div>

      {/* Persona A/B Performance Cards */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-100 mb-3 flex items-center gap-2">
          Сравнение эффективности резюме (A/B Тестирование двух персон)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personaComparison.map((p, idx) => (
            <div 
              key={idx}
              className={`border rounded-2xl p-4 flex flex-col justify-between ${p.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-zinc-100 text-sm">{p.name}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {p.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 my-3 text-center">
                  <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">Отправлено</span>
                    <span className="text-sm font-bold text-zinc-100">{p.applications}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">Просмотров</span>
                    <span className="text-sm font-bold text-violet-300">{p.views}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">% Просмотров</span>
                    <span className="text-sm font-bold text-cyan-300">{p.viewRate}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">Скринингов</span>
                    <span className="text-sm font-bold text-emerald-300">{p.interviews}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <span>Конверсия отклика в приглашение: <strong>{p.interviewRate}</strong></span>
                <span className="text-violet-400 hover:text-violet-300 cursor-pointer inline-flex items-center gap-1">
                  Подробнее <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
