'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertTriangle,
  Play,
  Settings2,
  Lock
} from 'lucide-react';
import { HHAccount } from '@/lib/types';

interface AccountsManagerProps {
  accounts: HHAccount[];
  onBumpAccount: (accountId: string, resumeId: string) => Promise<void>;
}

export function AccountsManager({ accounts, onBumpAccount }: AccountsManagerProps) {
  const [bumpingId, setBumpingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleBump = async (accId: string, resId: string) => {
    setBumpingId(resId);
    await onBumpAccount(accId, resId);
    setStatusMessage(`Резюме ${resId} успешно поднято! Следующее обновление через 4 часа.`);
    setBumpingId(null);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            Оркестратор Мульти-Аккаунтов hh.ru
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Управляй несколькими независимыми аккаунтами одновременно. Наш воркер автоматически поднимает резюме каждые 4 часа в топ поисковой выдачи эйчаров.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">
            Авто-воркер активен (2 аккаунта в ротации)
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
          >
            {/* Account Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm">{acc.name}</h3>
                  <span className="text-xs text-zinc-400 font-mono">{acc.accountEmail}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Подключен
                </div>
              </div>

              {/* Session credentials info */}
              <div className="mt-3 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Сессия:</span>
                  <span className="font-mono text-zinc-300 text-[11px]">{acc.credentialsMasked}</span>
                </div>
                <button className="text-[11px] text-violet-400 hover:text-violet-300">
                  Обновить
                </button>
              </div>

              {/* Resumes under this account */}
              <div className="mt-4 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                  Активные резюме:
                </span>
                {acc.resumes.map((res) => (
                  <div
                    key={res.id}
                    className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-200">{res.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Опубликовано
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
                      <div>
                        <span>Просмотры HR: </span>
                        <strong className="text-zinc-200">{res.viewsCount}</strong>
                      </div>
                      <div>
                        <span>В поиске: </span>
                        <strong className="text-zinc-200">{res.impressionsCount} раз</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Авто-поднятие через ~1ч 40м</span>
                      </div>

                      <button
                        onClick={() => handleBump(acc.id, res.id)}
                        disabled={bumpingId === res.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${bumpingId === res.id ? 'animate-spin' : ''}`} />
                        Поднять сейчас
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings Footer */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked={acc.autoBumpEnabled}
                  className="rounded border-zinc-700 bg-zinc-900 text-violet-600 focus:ring-0"
                />
                <span>Авто-поднятие каждые 4 часа</span>
              </label>

              <button className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5" />
                Параметры
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Cron Info */}
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-zinc-400">
        <Clock className="w-5 h-5 text-violet-400 shrink-0" />
        <div>
          <span className="font-semibold text-zinc-200">Бесплатный облачный планировщик: </span>
          Эндпоинт <code className="text-violet-300 bg-zinc-900 px-1 py-0.5 rounded font-mono">/api/hh/bump</code> вызывается автоматически каждые 4 часа через бесплатный Vercel Cron или GitHub Actions. Компьютер держать включенным не нужно!
        </div>
      </div>
    </div>
  );
}
