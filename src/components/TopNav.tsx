'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/store';

export function TopNav({ title, subtitle }: { title: string; subtitle?: string }) {
  const { accounts, bumpResume } = useApp();
  const [bumping, setBumping] = useState(false);
  const [bumpDone, setBumpDone] = useState(false);

  const handleBumpAll = async () => {
    setBumping(true);
    for (const acc of accounts) {
      for (const res of acc.resumes) {
        await bumpResume(acc.id, res.id);
      }
    }
    setBumping(false);
    setBumpDone(true);
    setTimeout(() => setBumpDone(false), 3000);
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-sm font-semibold text-zinc-100">{title}</h1>
        {subtitle && <p className="text-[11px] text-zinc-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* HH Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-zinc-400">hh.ru:</span>
          <span className="text-[11px] font-mono text-zinc-200">2 аккаунта активны</span>
        </div>

        {/* Global Bump button */}
        <button
          onClick={handleBumpAll}
          disabled={bumping}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {bumpDone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Поднято в топ!
            </>
          ) : (
            <>
              <RefreshCw className={`w-3.5 h-3.5 ${bumping ? 'animate-spin' : ''}`} />
              Поднять 2 резюме в топ
            </>
          )}
        </button>
      </div>
    </header>
  );
}
