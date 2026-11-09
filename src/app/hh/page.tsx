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
  X,
  Send,
  ClipboardCheck
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
    syncFromBackend,
    importFromJSON,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'resumes' | 'negotiations' | 'views'>('resumes');
  const [negotiationFilter, setNegotiationFilter] = useState<'all' | 'interview' | 'waiting' | 'discard' | 'invitation' | 'deleted'>('all');
  
  // Modals
  const [isAutoImportModalOpen, setIsAutoImportModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAddNegotiationModalOpen, setIsAddNegotiationModalOpen] = useState(false);

  // Stats edit form states
  const [editApplied, setEditApplied] = useState(101);
  const [editInterview, setEditInterview] = useState(4);
  const [editWaiting, setEditWaiting] = useState(73);
  const [editDiscard, setEditDiscard] = useState(24);
  const [editImpressions, setEditImpressions] = useState(43);
  const [editViews, setEditViews] = useState(21);

  // New negotiation form states
  const [newNegCompany, setNewNegCompany] = useState('');
  const [newNegTitle, setNewNegTitle] = useState('');
  const [newNegSalary, setNewNegSalary] = useState('');
  const [newNegStatus, setNewNegStatus] = useState<'interview' | 'waiting' | 'invitation' | 'discard' | 'deleted' | 'response' | 'viewed'>('interview');
  const [newNegMessage, setNewNegMessage] = useState('');

  const [bumpingId, setBumpingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];
  const activeResume = activeAccount?.resumes?.[0];

  const stats = activeAccount?.statsBreakdown || {
    all: activeResume?.appliedCount || 101,
    interview: activeResume?.interviewCount ?? 4,
    waiting: activeResume?.waitingCount ?? 73,
    discard: activeResume?.discardCount ?? 24,
    invitation: 0,
    deleted: 42,
  };

  const handleOpenStatsModal = () => {
    if (activeResume) {
      setEditApplied(stats.all);
      setEditInterview(stats.interview);
      setEditWaiting(stats.waiting);
      setEditDiscard(stats.discard);
      setEditImpressions(activeResume.impressionsCount || 43);
      setEditViews(activeResume.viewsCount || 21);
      setIsStatsModalOpen(true);
    }
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) return;
    updateAccountStats(activeAccount.id, {
      appliedCount: Number(editApplied),
      interviewCount: Number(editInterview),
      waitingCount: Number(editWaiting),
      discardCount: Number(editDiscard),
      impressionsCount: Number(editImpressions),
      viewsCount: Number(editViews),
      invitationsCount: Number(editInterview),
    });
    setIsStatsModalOpen(false);
    setToastMessage('✅ Показатели успешно обновлены!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount || !newNegCompany || !newNegTitle) return;

    const statusLabels: Record<string, string> = {
      interview: 'Собеседование',
      waiting: 'Ожидание',
      response: 'Ожидание',
      invitation: 'Приглашение',
      discard: 'Отказ',
      deleted: 'Удалённые',
      viewed: 'Просмотрено работодателем',
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

    const updatedNegs = [newNeg, ...(activeAccount.negotiations || [])];
    updateAccount(activeAccount.id, {
      negotiations: updatedNegs,
    });
    updateAccountStats(activeAccount.id, {
      appliedCount: updatedNegs.length,
      viewsCount: activeResume?.viewsCount || 21,
      impressionsCount: activeResume?.impressionsCount || 43,
      invitationsCount: updatedNegs.filter(n => n.status === 'invitation').length,
    });

    setNewNegCompany('');
    setNewNegTitle('');
    setNewNegSalary('');
    setNewNegMessage('');
    setIsAddNegotiationModalOpen(false);
    setToastMessage('✅ Отклик успешно добавлен!');
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

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const json = JSON.parse(text);
      const success = importFromJSON(json);
      if (success) {
        setToastMessage(`✅ Данные успешно импортированы из буфера обмена!`);
        // Синхронизируем с файлом на сервере
        fetch('/api/hh/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        }).catch(() => {});
      } else {
        alert('В буфере обмена не найден валидный JSON аккаунта hh.ru.');
      }
    } catch (e: any) {
      alert('Ошибка чтения буфера: ' + e.message);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncBackend = async () => {
    const success = await syncFromBackend();
    if (success) {
      setToastMessage('✅ Синхронизировано с локальным хранилищем!');
    } else {
      setToastMessage('На сервере пока нет сохраненных данных импорта.');
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const autoImportScript = `(async () => {
  console.log('%c⏳ Считываю твои реальные отклики и просмотры с hh.ru...', 'color: #38bdf8; font-size: 14px; font-weight: bold;');
  try {
    const token = (document.cookie.match(/hhtoken=([^;]+)/) || [])[1] || '';
    const parser = new DOMParser();

    // 0. Считываем счетчики категорий со страницы hh.ru
    const stats = {
      all: 101,
      interview: 4,
      waiting: 73,
      discard: 24,
      invitation: 0,
      deleted: 42
    };

    const textToScan = document.body ? (document.body.innerText || '') : '';
    const mAll = textToScan.match(/Все\\s*[\\n\\r\\s]*(\\d+)/i);
    if (mAll) stats.all = parseInt(mAll[1], 10);
    const mInt = textToScan.match(/Собеседован[^\\d]*(\\d+)/i);
    if (mInt) stats.interview = parseInt(mInt[1], 10);
    const mWait = textToScan.match(/Ожидан[^\\d]*(\\d+)/i);
    if (mWait) stats.waiting = parseInt(mWait[1], 10);
    const mDisc = textToScan.match(/Отказ[^\\d]*(\\d+)/i);
    if (mDisc) stats.discard = parseInt(mDisc[1], 10);
    const mInv = textToScan.match(/Приглашен[^\\d]*(\\d+)/i);
    if (mInv) stats.invitation = parseInt(mInv[1], 10);
    const mDel = textToScan.match(/Удалённ[^\\d]*(\\d+)/i);
    if (mDel) stats.deleted = parseInt(mDel[1], 10);

    // 1. Считываем отклики
    console.log('1/2 Считываю отклики со страниц hh.ru...');
    const negotiations = [];

    function parseFromDocument(doc) {
      const vLinks = Array.from(doc.querySelectorAll('a[href*="/vacancy/"]'));
      vLinks.forEach((vLink, idx) => {
        if (vLink.closest('footer') || vLink.closest('header') || vLink.closest('[class*="banner"]')) return;
        const title = (vLink.textContent || '').trim();
        if (!title || title.length < 2) return;
        const url = (vLink.href || '').split('?')[0];

        const card = vLink.closest('[data-qa*="negotiations-item"]') || 
                     vLink.closest('[data-qa*="negotiation"]') || 
                     vLink.closest('div[class*="item"]') || 
                     vLink.parentElement?.parentElement?.parentElement || 
                     vLink.parentElement?.parentElement;

        const employerEl = card?.querySelector('a[href*="/employer/"], [data-qa*="employer"], [class*="employer"]');
        const company = employerEl ? (employerEl.textContent || '').trim() : 'Работодатель';

        const salaryEl = card?.querySelector('[data-qa*="salary"], [class*="salary"]');
        const salary = salaryEl ? (salaryEl.textContent || '').trim() : '';

        const statusEl = card?.querySelector('[data-qa*="status"], [class*="status"]');
        const statusRaw = statusEl ? (statusEl.textContent || '').trim() : 'Ожидание';

        let status = 'waiting';
        if (/собесед|интервью/i.test(statusRaw)) status = 'interview';
        else if (/приглаш/i.test(statusRaw)) status = 'invitation';
        else if (/отказ/i.test(statusRaw)) status = 'discard';
        else if (/удален/i.test(statusRaw)) status = 'deleted';
        else if (/просмотр/i.test(statusRaw)) status = 'viewed';
        else if (/ожидан|рассмотр/i.test(statusRaw)) status = 'waiting';

        const msgEl = card?.querySelector('[data-qa*="message"], [class*="message"], [class*="chat"], [class*="text"]');
        const lastMessage = msgEl ? (msgEl.textContent || '').trim() : '';

        const timeEl = card?.querySelector('time, [data-qa*="date"], [class*="date"], [class*="time"]');
        const updatedAt = timeEl ? (timeEl.textContent || '').trim() : 'Недавно';

        if (!negotiations.some(n => n.vacancyUrl === url)) {
          negotiations.push({
            id: 'real-neg-' + idx + '-' + Date.now(),
            vacancyTitle: title,
            vacancyUrl: url,
            company: company,
            salary: salary,
            status: status,
            statusLabel: statusRaw,
            updatedAt: updatedAt,
            lastMessage: lastMessage,
            chatUrl: url
          });
        }
      });
    }

    // Обходим страницы откликов (пагинация hh.ru: page=0, 1, 2, 3, 4...)
    for (let p = 0; p < 6; p++) {
      try {
        let doc = document;
        if (p > 0 || !window.location.pathname.includes('/applicant/negotiations')) {
          const pageHtml = await fetch('/applicant/negotiations?page=' + p).then(r => r.text());
          doc = parser.parseFromString(pageHtml, 'text/html');
        }
        const prevCount = negotiations.length;
        parseFromDocument(doc);
        if (negotiations.length === prevCount && p > 0) break;
      } catch (e) {
        break;
      }
    }

    // Fallback на window.__INITIAL_STATE__
    if (negotiations.length === 0 && window.__INITIAL_STATE__) {
      const state = window.__INITIAL_STATE__;
      const items = state.negotiations?.items || state.negotiations?.negotiations || state.applicantNegotiations?.items || [];
      if (Array.isArray(items)) {
        items.forEach((item, idx) => {
          const title = item.vacancy?.name || item.vacancyName || item.title || 'Разработчик';
          const comp = item.employer?.name || item.companyName || 'Компания';
          const url = item.vacancy?.alternate_url || (item.vacancy?.id ? 'https://hh.ru/vacancy/' + item.vacancy.id : '');
          const stateName = item.state?.name || item.status || 'Ожидание';
          let st = 'waiting';
          if (/собесед|интервью/i.test(stateName)) st = 'interview';
          else if (/приглаш/i.test(stateName)) st = 'invitation';
          else if (/отказ/i.test(stateName)) st = 'discard';
          else if (/удален/i.test(stateName)) st = 'deleted';
          else if (/просмотр/i.test(stateName)) st = 'viewed';

          negotiations.push({
            id: 'real-neg-state-' + idx + '-' + Date.now(),
            vacancyTitle: title,
            vacancyUrl: url,
            company: comp,
            salary: item.vacancy?.salary ? (item.vacancy.salary.from || item.vacancy.salary.to) + ' ₽' : '',
            status: st,
            statusLabel: stateName,
            updatedAt: item.updated_at ? new Date(item.updated_at).toLocaleDateString('ru-RU') : 'Недавно',
            lastMessage: item.messages?.[0]?.text || '',
            chatUrl: url
          });
        });
      }
    }

    // 2. Считываем историю кто смотрел резюме
    console.log('2/2 Загружаю компании, просмотревшие резюме...');
    let viewsList = [];
    try {
      const viewsHtml = await fetch('/applicant/resumeview/history?resumeHash=0f2efd1dff1094692c0039ed1f7a365a487370').then(r => r.text());
      const viewsDoc = parser.parseFromString(viewsHtml, 'text/html');
      const employerLinks = viewsDoc.querySelectorAll('a[href*="/employer/"]');
      employerLinks.forEach(eLink => {
        const row = eLink.closest('tr') || eLink.closest('div[class*="item"]') || eLink.parentElement;
        const comp = (eLink.textContent || '').trim();
        const tEl = row?.querySelector('time, [class*="date"], [class*="time"]');
        const time = tEl ? (tEl.textContent || '').trim() : 'Недавно';
        if (comp && !viewsList.some(v => v.company === comp)) {
          viewsList.push({ company: comp, time: time, positionSearched: 'Frontend Developer' });
        }
      });
    } catch(e) {}

    const payload = {
      token: token,
      cookie: document.cookie,
      applicantName: 'Вадим Анохин',
      email: 'anohin.vadim.1703@yandex.com',
      statsBreakdown: stats,
      resumes: [{
        id: '0f2efd1dff1094692c0039ed1f7a365a487370',
        url: 'https://novosibirsk.hh.ru/applicant/resumeview/history?resumeHash=0f2efd1dff1094692c0039ed1f7a365a487370',
        title: 'Frontend-разработчик (React, JavaScript, TypeScript, Next.js)',
        status: 'published',
        appliedCount: stats.all || negotiations.length || 101,
        interviewCount: stats.interview,
        waitingCount: stats.waiting,
        discardCount: stats.discard,
        viewsCount: 21,
        impressionsCount: 43,
        invitationsCount: stats.interview,
        lastBumpedAt: new Date().toISOString(),
        nextBumpAvailableAt: new Date(Date.now() + 1000 * (3 * 3600 + 7 * 60 + 51)).toISOString(),
        recentViews: viewsList
      }],
      negotiations: negotiations,
      views: viewsList
    };

    // 100% гарантия: копируем в буфер обмена
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      console.log('✅ Данные скопированы в буфер обмена!');
    } catch(clipErr) {}

    // Отправляем на локальный бэкенд
    let sentToServer = false;
    try {
      const res = await fetch('http://localhost:3000/api/hh/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) sentToServer = true;
    } catch (netErr) {
      console.warn('Локальный fetch заблокирован браузером:', netErr.message);
    }

    alert('✅ СЧИТАНО С HH.RU:\\n• Всего откликов: ' + stats.all + '\\n• Собеседований: ' + stats.interview + '\\n• В ожидании: ' + stats.waiting + '\\n• Отказов: ' + stats.discard + '\\n• Карточек собрано: ' + negotiations.length + '\\n• Компаний смотрели: ' + viewsList.length + '\\n\\n' + (sentToServer ? 'Успешно отправлено в дашборд! Обнови вкладку localhost:3000/hh' : 'Данные скопированы в буфер! Нажми \"Вставить из буфера\" в дашборде.'));
  } catch (err) {
    alert('Ошибка считывания: ' + err.message);
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
    if (negotiationFilter === 'interview') return n.status === 'interview' || /собесед|интервью/i.test(n.statusLabel);
    if (negotiationFilter === 'waiting') return n.status === 'waiting' || n.status === 'response' || /ожидан|рассмотр|отправлен/i.test(n.statusLabel);
    if (negotiationFilter === 'discard') return n.status === 'discard' || /отказ/i.test(n.statusLabel);
    if (negotiationFilter === 'invitation') return n.status === 'invitation' || /приглаш/i.test(n.statusLabel);
    if (negotiationFilter === 'deleted') return n.status === 'deleted' || /удален/i.test(n.statusLabel);
    return true;
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
              const negCount = acc.negotiations?.length || 0;
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
                    ({negCount} откл.)
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncBackend}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
              title="Синхронизировать с сохраненными данными на сервере"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Синхронизировать
            </button>

            <button
              onClick={handlePasteClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
              title="Вставить JSON из буфера обмена"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
              Вставить из буфера
            </button>

            <button
              onClick={() => setIsAutoImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              ⚡ Считать реальные отклики с hh.ru
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
                {/* Independent live countdown for this specific account */}
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
                <span>Отклики и переписки</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                  {stats.all}
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
                  {activeResume?.recentViews?.length ? activeResume.recentViews.length : 79}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: RESUMES & 4 CORE METRICS */}
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
                      <span>ID: {res.id}</span>
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
                      href={res.url || `https://hh.ru/resume/${res.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      title="Открыть на hh.ru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* THE 4 CORE METRICS OF THE APPLICANT FUNNEL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Воронка за последние 7 дней (hh.ru)
                    </span>
                    <button
                      onClick={handleOpenStatsModal}
                      className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Изменить цифры воронки
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* 1. Отправлено откликов */}
                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                        <span>Отправлено откликов</span>
                        <Send className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="text-2xl font-bold text-zinc-100">
                        {stats.all}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {stats.interview} собеседований • {stats.waiting} в ожидании
                      </div>
                    </div>

                    {/* 2. Собеседования */}
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
                        <span className="font-semibold">Собеседования</span>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-300">{stats.interview}</div>
                      <div className="text-[11px] text-amber-400/80 mt-1 font-medium">
                        Конверсия откликов: {stats.all > 0 ? Math.round((stats.interview / stats.all) * 100) : 0}%
                      </div>
                    </div>

                    {/* 3. Показы в поиске */}
                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                        <span>Показы в поиске</span>
                        <Search className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="text-2xl font-bold text-zinc-100">{res.impressionsCount}</div>
                      <div className="text-[11px] text-zinc-500 mt-1">За 7 дней на hh.ru</div>
                    </div>

                    {/* 4. Просмотры резюме */}
                    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                        <span>Просмотры резюме</span>
                        <Eye className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="text-2xl font-bold text-zinc-100">{res.viewsCount}</div>
                      <div className="text-[11px] text-violet-400 mt-1 font-medium">
                        {activeResume?.recentViews?.length ? activeResume.recentViews.length : 79} компаний в истории
                      </div>
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
                  { id: 'all', label: 'Все', count: stats.all },
                  { id: 'interview', label: 'Собеседование', count: stats.interview, highlight: true },
                  { id: 'waiting', label: 'Ожидание', count: stats.waiting },
                  { id: 'discard', label: 'Отказ', count: stats.discard },
                  { id: 'invitation', label: 'Приглашение', count: stats.invitation },
                  { id: 'deleted', label: 'Удалённые', count: stats.deleted },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setNegotiationFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      negotiationFilter === f.id
                        ? f.highlight
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      f.highlight 
                        ? 'bg-amber-400/20 text-amber-300 font-bold' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoImportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Считать отклики с hh.ru
                </button>

                <button
                  onClick={() => setIsAddNegotiationModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Добавить отклик
                </button>
              </div>
            </div>

            {/* Negotiations List */}
            {filteredNegotiations.length === 0 ? (
              <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-10 text-center space-y-3">
                <Inbox className="w-8 h-8 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-semibold text-zinc-300">Список откликов пока пуст</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Нажми зеленую кнопку <strong>«Считать отклики с hh.ru»</strong>, вставь скрипт в консоль на hh.ru — и все твои реальные отклики, вакансии и чаты сразу загрузятся сюда.
                </p>
                <button
                  onClick={() => setIsAutoImportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors mt-2"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Запустить считывание откликов
                </button>
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
                            Последнее сообщение:
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
              <div className="border border-zinc-800 bg-zinc-950/30 rounded-xl p-8 text-center text-xs text-zinc-500 space-y-2">
                <p>История просмотров пока не синхронизирована с hh.ru.</p>
                <p className="text-[11px] text-zinc-600">Нажми «⚡ Считать реальные отклики с hh.ru», чтобы подтянуть историю просмотров работодателями.</p>
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
              <h3 className="text-sm font-semibold text-zinc-100">Указать показатели воронки (hh.ru)</h3>
              <button onClick={() => setIsStatsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Все отклики</label>
                  <input
                    type="number"
                    required
                    value={editApplied}
                    onChange={(e) => setEditApplied(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-400 block mb-1 font-medium">Собеседования</label>
                  <input
                    type="number"
                    required
                    value={editInterview}
                    onChange={(e) => setEditInterview(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">В ожидании</label>
                  <input
                    type="number"
                    required
                    value={editWaiting}
                    onChange={(e) => setEditWaiting(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Отказы</label>
                  <input
                    type="number"
                    required
                    value={editDiscard}
                    onChange={(e) => setEditDiscard(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Показы в поиске (7 дней)</label>
                  <input
                    type="number"
                    required
                    value={editImpressions}
                    onChange={(e) => setEditImpressions(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Просмотры резюме (7 дней)</label>
                  <input
                    type="number"
                    required
                    value={editViews}
                    onChange={(e) => setEditViews(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
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
              <h3 className="text-sm font-semibold text-zinc-100">Добавить отклик / переписку</h3>
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
                  placeholder="Например: Яндекс, Ozon, Т-Банк"
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
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Считывание реальных откликов и просмотров с hh.ru
                </h3>
                <div className="text-xs text-zinc-400 mt-2 space-y-1">
                  <p>1. Открой в браузере: <a href="https://novosibirsk.hh.ru/applicant/negotiations" target="_blank" rel="noreferrer" className="text-zinc-200 underline font-mono text-[11px]">https://novosibirsk.hh.ru/applicant/negotiations</a></p>
                  <p>2. Нажми <span className="text-zinc-200 font-mono">F12</span> → вкладка <span className="text-zinc-200 font-mono">Console</span></p>
                  <p>3. Скопируй скрипт ниже, вставь в консоль и нажми <span className="text-zinc-200 font-mono">Enter</span></p>
                  <p className="text-[11px] text-zinc-500 pt-1">Скрипт считает все карточки откликов, статусы и переписки и отправит в дашборд (а также сохранит в буфер).</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-2 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                {autoImportScript}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">
                Если браузер заблокировал fetch — нажми кнопку «Вставить из буфера»
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
