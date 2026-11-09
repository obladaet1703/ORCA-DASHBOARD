'use client';

import React, { useState } from 'react';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { 
  Building2, 
  ShieldCheck, 
  Key, 
  Plus, 
  RefreshCw, 
  Clock, 
  Eye, 
  Search, 
  CheckCircle2, 
  Edit3, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function HHPortalPage() {
  const { 
    accounts, 
    activeAccountId, 
    setActiveAccountId, 
    addAccount, 
    updateAccountSession, 
    bumpResume, 
    addResumeToAccount,
    resumes 
  } = useApp();

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccCookie, setNewAccCookie] = useState('');

  const [isAddResumeModalOpen, setIsAddResumeModalOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [bumpingId, setBumpingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];

  const handleBump = async (accId: string, resId: string) => {
    setBumpingId(resId);
    await bumpResume(accId, resId);
    setBumpingId(null);
    setToastMessage('Резюме успешно поднято в топ выдачи hh.ru! Таймер сброшен на 4 часа.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;
    addAccount({
      name: newAccName,
      accountEmail: newAccEmail,
      status: 'connected',
      authMethod: 'cookie',
      credentialsMasked: `hhtoken=***${newAccCookie ? newAccCookie.slice(-6) : '89fa1'} (Active)`,
      resumes: [
        {
          id: `hh-res-${Date.now()}`,
          title: 'Новое резюме',
          status: 'published',
          viewsCount: 0,
          impressionsCount: 0,
          lastBumpedAt: new Date().toISOString(),
          nextBumpAvailableAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        }
      ],
      autoBumpEnabled: true,
      lastCheckedAt: new Date().toISOString(),
    });
    setNewAccName('');
    setNewAccEmail('');
    setNewAccCookie('');
    setIsAddAccountModalOpen(false);
  };

  const handleCreateResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeTitle || !activeAccount) return;
    addResumeToAccount(activeAccount.id, {
      title: newResumeTitle,
      status: 'published',
    });
    setNewResumeTitle('');
    setIsAddResumeModalOpen(false);
    setToastMessage('Новое резюме добавлено в аккаунт hh.ru!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Наш hh.ru" 
        subtitle="Мульти-аккаунт хаб • просмотры, резюме и авто-поднятие каждые 4 часа" 
      />

      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-lg bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Account Tabs / Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            {accounts.map((acc) => {
              const isSelected = acc.id === activeAccount.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setActiveAccountId(acc.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm'
                      : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{acc.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({acc.resumes.length})</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsAddAccountModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Подключить ещё аккаунт hh
          </button>
        </div>

        {/* Active Account Overview Card */}
        <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-100">{activeAccount.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Авторизован
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">{activeAccount.accountEmail}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Сессия: <strong className="text-zinc-300 font-mono">{activeAccount.credentialsMasked}</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3">
              <span className="text-[11px] text-zinc-500 block">Резюме в аккаунте</span>
              <span className="text-lg font-bold text-zinc-100">{activeAccount.resumes.length}</span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3">
              <span className="text-[11px] text-zinc-500 block">Всего просмотров HR</span>
              <span className="text-lg font-bold text-zinc-100">
                {activeAccount.resumes.reduce((acc, r) => acc + (r.viewsCount || 0), 0)}
              </span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3">
              <span className="text-[11px] text-zinc-500 block">Показов в выдаче</span>
              <span className="text-lg font-bold text-zinc-100">
                {activeAccount.resumes.reduce((acc, r) => acc + (r.impressionsCount || 0), 0)}
              </span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3">
              <span className="text-[11px] text-zinc-500 block">Авто-поднятие</span>
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Каждые 4 часа
              </span>
            </div>
          </div>
        </div>

        {/* Resumes Header & Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Резюме в этом аккаунте</h3>
            <p className="text-xs text-zinc-500">Управляй статусами, обновляй описания и поднимай в выдаче</p>
          </div>

          <button
            onClick={() => setIsAddResumeModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            + Добавить резюме
          </button>
        </div>

        {/* Resumes List */}
        <div className="space-y-3">
          {activeAccount.resumes.map((res) => (
            <div
              key={res.id}
              className="border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-xl p-4 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-zinc-100">{res.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Опубликовано
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      <strong>{res.viewsCount}</strong> просмотров HR
                    </span>
                    <span className="flex items-center gap-1">
                      <Search className="w-3.5 h-3.5 text-zinc-500" />
                      <strong>{res.impressionsCount}</strong> показов в поиске
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      Авто-поднятие через ~1ч 40м
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBump(activeAccount.id, res.id)}
                    disabled={bumpingId === res.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium border border-zinc-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${bumpingId === res.id ? 'animate-spin text-zinc-400' : ''}`} />
                    Поднять сейчас
                  </button>

                  <a
                    href="https://hh.ru/applicant/resumes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800"
                  >
                    <span>Оригинал</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Incoming hh events / responses preview */}
        <div className="border border-zinc-800/80 bg-zinc-950/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Последние события из hh.ru
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Синхронизировано 2 мин назад</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200">Резюме просмотрено: Mindbox</span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Вакансия: Senior / Middle Frontend разработчик</p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">2 часа назад</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200">Приглашение на скрининг: Skyeng</span>
                <p className="text-[11px] text-zinc-400 mt-0.5">HR написала в чат hh: «Вадим, добрый день! Заинтересовал ваш опыт в EdTech...»</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Вчера, 17:40</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Add HH Account */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Подключить аккаунт hh.ru</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Для работы оркестратора скопируй значение сессионной куки <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded font-mono">hhtoken</code> из DevTools (F12 → Storage → Cookies → hh.ru).
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Название аккаунта</label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="Например: Аккаунт №2 (Fullstack)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Email от hh.ru</label>
                <input
                  type="email"
                  required
                  value={newAccEmail}
                  onChange={(e) => setNewAccEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Кука сессии (hhtoken)</label>
                <input
                  type="password"
                  value={newAccCookie}
                  onChange={(e) => setNewAccCookie(e.target.value)}
                  placeholder="Вставь hhtoken или оставь пустым для тестового режима"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Подключить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Resume */}
      {isAddResumeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Создать резюме на hh.ru</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Резюме будет привязано к аккаунту <strong>{activeAccount.name}</strong> и начнет автоматически подниматься каждые 4 часа.
              </p>
            </div>

            <form onSubmit={handleCreateResume} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Желаемая должность</label>
                <input
                  type="text"
                  required
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  placeholder="Например: Middle+ Frontend Engineer (React, Next.js)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddResumeModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Создать резюме
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
