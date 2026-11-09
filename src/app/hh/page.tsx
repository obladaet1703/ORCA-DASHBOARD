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
  ArrowUpRight,
  Trash2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function HHPortalPage() {
  const { 
    accounts, 
    activeAccountId, 
    setActiveAccountId, 
    addAccount, 
    updateAccountSession, 
    deleteAccount,
    bumpResume, 
    addResumeToAccount,
  } = useApp();

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccCookie, setNewAccCookie] = useState('');

  const [isUpdateSessionModalOpen, setIsUpdateSessionModalOpen] = useState(false);
  const [updateCookieValue, setUpdateCookieValue] = useState('');

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

  const handleDeleteCurrentAccount = () => {
    if (!activeAccount) return;
    if (confirm(`Ты уверен, что хочешь удалить ${activeAccount.name}?`)) {
      deleteAccount(activeAccount.id);
      setToastMessage(`Аккаунт ${activeAccount.name} успешно удален.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;
    addAccount({
      name: newAccName,
      accountEmail: newAccEmail,
      status: 'connected',
      authMethod: 'cookie',
      credentialsMasked: `hhtoken=***${newAccCookie ? newAccCookie.slice(-6) : 'live'} (Подключено)`,
      resumes: [
        {
          id: `hh-res-${Date.now()}`,
          title: 'Frontend / Fullstack разработчик',
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
    setToastMessage('Новый аккаунт hh.ru успешно добавлен в оркестратор!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateCookieValue || !activeAccount) return;
    updateAccountSession(activeAccount.id, updateCookieValue);
    setUpdateCookieValue('');
    setIsUpdateSessionModalOpen(false);
    setToastMessage(`Сессия для ${activeAccount.name} успешно обновлена!`);
    setTimeout(() => setToastMessage(null), 3000);
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

        {/* Info Banner: How auth works */}
        <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-4 text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span>Как работает подключение аккаунтов к hh.ru?</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Поскольку hh.ru закрыл публичный API от внешних программ, наш оркестратор работает через <strong>сессионную авторизацию браузера (<code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded font-mono">hhtoken</code>)</strong>. 
            Сервер отправляет запросы от твоего имени, будто ты открыл сайт руками. Это позволяет поднимать резюме каждые 4 часа на автомате и отслеживать просмотры.
          </p>
          <div className="pt-1 flex flex-wrap gap-4 text-[11px] text-zinc-500">
            <span>• 1. Открой <a href="https://hh.ru" target="_blank" rel="noreferrer" className="text-zinc-300 underline">hh.ru</a></span>
            <span>• 2. Нажми F12 → Storage / Application → Cookies → скопируй значение <code className="text-zinc-300">hhtoken</code></span>
            <span>• 3. Нажми кнопку «Обновить сессию» ниже и вставь токен</span>
          </div>
        </div>

        {/* Account Tabs / Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            {accounts.map((acc) => {
              const isSelected = activeAccount && acc.id === activeAccount.id;
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            + Подключить ещё аккаунт hh
          </button>
        </div>

        {/* Active Account Overview Card */}
        {activeAccount ? (
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-zinc-100">{activeAccount.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Активен
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">{activeAccount.accountEmail}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUpdateSessionModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-zinc-400" />
                  Обновить сессию (hhtoken)
                </button>

                {accounts.length > 1 && (
                  <button
                    onClick={handleDeleteCurrentAccount}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors"
                    title="Удалить этот аккаунт"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
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
        ) : (
          <div className="p-8 border border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
            Нет активных аккаунтов. Нажми «+ Подключить ещё аккаунт hh».
          </div>
        )}

        {/* Resumes Header & Action */}
        {activeAccount && (
          <>
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Резюме в этом аккаунте</h3>
                <p className="text-xs text-zinc-500">Управляй статусами, обновляй описания и поднимай в выдаче</p>
              </div>

              <button
                onClick={() => setIsAddResumeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors"
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
                        <span>На hh.ru</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
                  placeholder="Например: Второй аккаунт (Fullstack)"
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
                  placeholder="Вставь hhtoken из DevTools"
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

      {/* Modal: Update Session Cookie */}
      {isUpdateSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Обновить сессию для {activeAccount.name}</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Вставь свежий <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded font-mono">hhtoken</code> из браузера, чтобы оркестратор продолжал авто-поднятие.
              </p>
            </div>

            <form onSubmit={handleUpdateSession} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Значение hhtoken</label>
                <input
                  type="password"
                  required
                  value={updateCookieValue}
                  onChange={(e) => setUpdateCookieValue(e.target.value)}
                  placeholder="hVcjbk1kLBY7z_uM3IdMZU..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateSessionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold"
                >
                  Сохранить токен
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
