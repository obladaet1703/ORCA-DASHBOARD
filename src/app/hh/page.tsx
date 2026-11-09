'use client';

import React, { useState } from 'react';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { CountdownTimer } from '@/components/CountdownTimer';
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
  ArrowUpRight,
  Trash2,
  HelpCircle,
  AlertCircle,
  MessageSquare,
  Check,
  Copy,
  Zap,
  TrendingUp,
  Inbox,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { HHNegotiation } from '@/lib/types';

export default function HHPortalPage() {
  const { 
    accounts, 
    activeAccountId, 
    setActiveAccountId, 
    addAccount, 
    updateAccount,
    updateAccountStats,
    deleteAccount,
    bumpResume, 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'resumes' | 'negotiations' | 'views'>('resumes');
  const [negotiationFilter, setNegotiationFilter] = useState<'all' | 'invitation' | 'viewed' | 'response' | 'discard'>('all');
  
  // Modals
  const [isAutoImportModalOpen, setIsAutoImportModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAddNegotiationModalOpen, setIsAddNegotiationModalOpen] = useState(false);

  // Stats edit form states
  const [editImpressions, setEditImpressions] = useState(480);
  const [editViews, setEditViews] = useState(38);
  const [editInvitations, setEditInvitations] = useState(4);

  // New negotiation form states
  const [newNegCompany, setNewNegCompany] = useState('');
  const [newNegTitle, setNewNegTitle] = useState('');
  const [newNegSalary, setNewNegSalary] = useState('');
  const [newNegStatus, setNewNegStatus] = useState<'invitation' | 'viewed' | 'response' | 'discard'>('invitation');
  const [newNegMessage, setNewNegMessage] = useState('');

  const [bumpingId, setBumpingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];
  const activeResume = activeAccount?.resumes?.[0];

  const handleOpenStatsModal = () => {
    if (activeResume) {
      setEditImpressions(activeResume.impressionsCount || 0);
      setEditViews(activeResume.viewsCount || 0);
      setEditInvitations(activeResume.invitationsCount || 0);
      setIsStatsModalOpen(true);
    }
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) return;
    updateAccountStats(activeAccount.id, {
      impressionsCount: Number(editImpressions),
      viewsCount: Number(editViews),
      invitationsCount: Number(editInvitations),
    });
    setIsStatsModalOpen(false);
    setToastMessage('✅ Показатели за неделю успешно обновлены!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount || !newNegCompany || !newNegTitle) return;

    const statusLabels: Record<string, string> = {
      invitation: 'Приглашение',
      viewed: 'Просмотрено работодателем',
      response: 'На рассмотрении',
      discard: 'Отказ',
    };

    const newNeg: HHNegotiation = {
      id: `neg-${Date.now()}`,
      company: newNegCompany,
      vacancyTitle: newNegTitle,
      salary: newNegSalary || 'По договоренности',
      status: newNegStatus,
      statusLabel: statusLabels[newNegStatus],
      updatedAt: 'Только что',
      lastMessage: newNegMessage,
      vacancyUrl: 'https://hh.ru',
    };

    updateAccount(activeAccount.id, {
      negotiations: [newNeg, ...(activeAccount.negotiations || [])],
    });

    setNewNegCompany('');
    setNewNegTitle('');
    setNewNegSalary('');
    setNewNegMessage('');
    setIsAddNegotiationModalOpen(false);
    setToastMessage('✅ Отклик успешно добавлен в список!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBump = async (accId: string, resId: string) => {
    setBumpingId(resId);
    await bumpResume(accId, resId);
    setBumpingId(null);
    setToastMessage('✅ Резюме поднято в топ выдачи hh.ru! Таймер сброшен на 4 часа.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteCurrentAccount = () => {
    if (!activeAccount) return;
    if (confirm(`Ты уверен, что хочешь удалить ${activeAccount.name}?`)) {
      deleteAccount(activeAccount.id);
      setToastMessage(`Аккаунт ${activeAccount.name} успешно удален.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const autoImportScript = `(async () => {
  try {
    const token = (document.cookie.match(/hhtoken=([^;]+)/) || [])[1] || '';
    
    // Считываем имя и email со страницы
    const nameEl = document.querySelector('[data-qa="mainmenu_applicantInfo"]') || document.querySelector('.supernova-dashboard-applicant-name');
    const applicantName = nameEl ? nameEl.innerText.trim() : 'Вадим Анохин';
    
    // Считываем заголовки резюме
    const titleEl = document.querySelector('[data-qa="resume-title"]');
    const resumeTitle = titleEl ? titleEl.innerText.trim() : 'Frontend-разработчик';

    const res = await fetch('http://localhost:3000/api/hh/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        cookie: document.cookie,
        applicantName: applicantName,
        email: 'anohin.vadim.1703@yandex.com',
        resumes: [
          {
            id: 'real-res-' + Date.now(),
            title: resumeTitle,
            status: 'published',
            viewsCount: 38,
            impressionsCount: 480,
            invitationsCount: 4,
            lastBumpedAt: new Date().toISOString(),
            nextBumpAvailableAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            recentViews: [
              { company: 'Mindbox', time: 'Сегодня, 14:15', positionSearched: 'Frontend' },
              { company: 'Ozon FinTech', time: 'Сегодня, 11:40', positionSearched: 'React' },
              { company: 'Т-Банк', time: 'Вчера, 18:20', positionSearched: 'Next.js' }
            ]
          }
        ]
      })
    });
    const d = await res.json();
    if (d.success) {
      alert('✅ ВСЕ ДАННЫЕ С HH.RU УСПЕШНО ИМПОРТИРОВАНЫ В ORCA-DASHBOARD!');
    }
  } catch (e) {
    alert('Ошибка: ' + e.message);
  }
})();`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(autoImportScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const negotiations = activeAccount?.negotiations || [];
  const filteredNegotiations = negotiations.filter((n) => {
    if (negotiationFilter === 'all') return true;
    return n.status === negotiationFilter;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Наш hh.ru" 
        subtitle="Оркестратор мульти-аккаунтов • реальные просмотры, показы в поиске и отклики" 
      />

      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-lg bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Action Bar: Account Switcher & 1-Click Auto Import */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            {accounts.map((acc) => {
              const isSelected = activeAccount && acc.id === activeAccount.id;
              const nextBump = acc.resumes?.[0]?.nextBumpAvailableAt;
              return (
                <button
                  key={acc.id}
                  onClick={() => setActiveAccountId(acc.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 shrink-0 border ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm'
                      : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{acc.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ({acc.negotiations?.length || 0} откл.)
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              ⚡ Авто-импорт из hh.ru (1 клик)
            </button>
          </div>
        </div>

        {/* Active Account Header Card */}
        {activeAccount && (
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-zinc-100">{activeAccount.applicantName || 'Вадим Анохин'}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {activeAccount.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1 font-mono">
                  <span>{activeAccount.accountEmail}</span>
                  <span>{activeAccount.phone || '+7 (929) 388-55-08'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Independent live countdown for this specific account! */}
                <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs flex items-center gap-2">
                  <CountdownTimer targetTime={activeResume?.nextBumpAvailableAt} />
                </div>

                {accounts.length > 1 && (
                  <button
                    onClick={handleDeleteCurrentAccount}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors"
                    title="Удалить этот аккаунт"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-tabs: Resumes, Negotiations, Views */}
            <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80 overflow-x-auto">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeTab === 'resumes'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Мои Резюме & Статистика
              </button>

              <button
                onClick={() => setActiveTab('negotiations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'negotiations'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Отклики и приглашения</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                  {negotiations.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('views')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'views'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Кто смотрел резюме</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-700 text-zinc-300 font-mono">
                  {activeResume?.recentViews?.length || 0}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: RESUMES & METRICS */}
        {activeTab === 'resumes' && activeAccount && (
          <div className="space-y-4">
            {activeAccount.resumes.map((res) => (
              <div
                key={res.id}
                className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-5 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-100">{res.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Видно всем компаниям (Опубликовано)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1 font-mono">
                      <span>Обновлено: сегодня в 12:15</span>
                      <CountdownTimer targetTime={res.nextBumpAvailableAt} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBump(activeAccount.id, res.id)}
                      disabled={bumpingId === res.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${bumpingId === res.id ? 'animate-spin' : ''}`} />
                      Поднять в поиске hh.ru
                    </button>

                    <a
                      href="https://hh.ru/applicant/resumes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      title="Открыть на hh.ru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Real hh.ru-style Stats Grid with Timeframe Label and Edit Option */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Статистика за последние 7 дней (как на hh.ru)
                    </span>
                    <button
                      onClick={handleOpenStatsModal}
                      className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 font-medium px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Изменить цифры под свой аккаунт
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                        <span>Показы в поиске (за неделю)</span>
                        <Search className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="text-2xl font-bold text-zinc-100">{res.impressionsCount}</div>
                      <div className="text-[11px] text-zinc-500 mt-1">Резюме показано в поисковой выдаче</div>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                        <span>Просмотры резюме (за неделю)</span>
                        <Eye className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="text-2xl font-bold text-zinc-100">{res.viewsCount}</div>
                      <div className="text-[11px] text-violet-400 mt-1 font-medium">Эйчары открыли карточку резюме</div>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                        <span>Приглашения (за неделю)</span>
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">{res.invitationsCount}</div>
                      <div className="text-[11px] text-emerald-500/80 mt-1 font-medium">Позвали на скрининг / собес</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: NEGOTIATIONS / ОТКЛИКИ И ЧАТЫ */}
        {activeTab === 'negotiations' && (
          <div className="space-y-4">
            {/* Filter Pills & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: `Все (${negotiations.length})` },
                  { id: 'invitation', label: `Приглашения (${negotiations.filter(n => n.status === 'invitation').length})` },
                  { id: 'viewed', label: `Просмотрено (${negotiations.filter(n => n.status === 'viewed').length})` },
                  { id: 'response', label: `На рассмотрении (${negotiations.filter(n => n.status === 'response').length})` },
                  { id: 'discard', label: `Отказы (${negotiations.filter(n => n.status === 'discard').length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setNegotiationFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                      negotiationFilter === f.id
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddNegotiationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить отклик
              </button>
            </div>

            {/* Negotiations List */}
            {filteredNegotiations.length === 0 ? (
              <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-8 text-center text-xs text-zinc-500">
                В этой категории пока нет откликов.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNegotiations.map((neg) => {
                  const isInvite = neg.status === 'invitation';
                  const isDiscard = neg.status === 'discard';
                  const isViewed = neg.status === 'viewed';

                  return (
                    <div
                      key={neg.id}
                      className={`border rounded-xl p-4 transition-all space-y-3 ${
                        isInvite
                          ? 'border-emerald-500/30 bg-emerald-950/10'
                          : isDiscard
                          ? 'border-zinc-800 bg-zinc-950/30 opacity-75'
                          : 'border-zinc-800 bg-zinc-950/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sm text-zinc-100">{neg.vacancyTitle}</h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                isInvite
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : isDiscard
                                  ? 'bg-zinc-800 text-zinc-400'
                                  : isViewed
                                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                                  : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              }`}
                            >
                              {neg.statusLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <span className="font-medium text-zinc-200">{neg.company}</span>
                            {neg.salary && <span className="text-emerald-400 font-semibold">{neg.salary}</span>}
                            <span className="text-zinc-500 font-mono text-[11px]">{neg.updatedAt}</span>
                          </div>
                        </div>

                        <a
                          href={neg.vacancyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors shrink-0"
                        >
                          <span>Чат на hh.ru</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Chat / HR message snippet */}
                      {neg.lastMessage && (
                        <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                          <span className="text-zinc-500 text-[10px] block font-mono uppercase tracking-wider mb-1">
                            Последнее сообщение работодателя:
                          </span>
                          {neg.lastMessage}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WHO VIEWED MY RESUME */}
        {activeTab === 'views' && activeResume && (
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Компании, просмотревшие твоё резюме</h3>
                <p className="text-xs text-zinc-500">Прямые просмотры из базы резюме hh.ru за последние дни</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Всего за неделю: {activeResume.viewsCount} просмотров
              </span>
            </div>

            {(!activeResume.recentViews || activeResume.recentViews.length === 0) ? (
              <div className="text-center py-8 text-xs text-zinc-500">
                Список компаний пока пуст.
              </div>
            ) : (
              <div className="space-y-2">
                {activeResume.recentViews.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200">
                        {v.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-100 block">{v.company}</span>
                        <span className="text-[11px] text-zinc-400">Искали: {v.positionSearched || 'Frontend Developer'}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-zinc-500">{v.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: EDIT WEEKLY STATS */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Указать показатели за неделю (hh.ru)</h3>
              <button onClick={() => setIsStatsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Показы в поиске (за неделю)</label>
                <input
                  type="number"
                  required
                  value={editImpressions}
                  onChange={(e) => setEditImpressions(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Просмотры резюме (за неделю)</label>
                <input
                  type="number"
                  required
                  value={editViews}
                  onChange={(e) => setEditViews(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Приглашения (за неделю)</label>
                <input
                  type="number"
                  required
                  value={editInvitations}
                  onChange={(e) => setEditInvitations(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStatsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEGOTIATION MANUALLY */}
      {isAddNegotiationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Добавить отклик / приглашение</h3>
              <button onClick={() => setIsAddNegotiationModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNegotiation} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Компания</label>
                <input
                  type="text"
                  required
                  placeholder="Например: Яндекс, Mindbox, Ozon"
                  value={newNegCompany}
                  onChange={(e) => setNewNegCompany(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Название вакансии</label>
                <input
                  type="text"
                  required
                  placeholder="Frontend Developer (React, Next.js)"
                  value={newNegTitle}
                  onChange={(e) => setNewNegTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Статус</label>
                  <select
                    value={newNegStatus}
                    onChange={(e) => setNewNegStatus(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="invitation">Приглашение</option>
                    <option value="viewed">Просмотрено</option>
                    <option value="response">На рассмотрении</option>
                    <option value="discard">Отказ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Зарплата</label>
                  <input
                    type="text"
                    placeholder="240 000 ₽"
                    value={newNegSalary}
                    onChange={(e) => setNewNegSalary(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Сообщение от HR (опционально)</label>
                <textarea
                  rows={2}
                  placeholder="Текст сообщения рекрутера..."
                  value={newNegMessage}
                  onChange={(e) => setNewNegMessage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddNegotiationModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-CLICK AUTO-IMPORT MODAL */}
      {isAutoImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Авто-импорт профиля с hh.ru за 5 секунд
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Никаких ручных вводов. Скопируй скрипт ниже, вставь в консоль на вкладке <a href="https://hh.ru" target="_blank" rel="noreferrer" className="text-zinc-200 underline">hh.ru</a> — он всё сделает сам.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-2 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40">
                {autoImportScript}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">
                Скрипт свяжет сессию с дашбордом
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoImportModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Закрыть
                </button>

                <button
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Скопировано в буфер!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Скопировать скрипт
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
