'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Send, 
  FileText, 
  Kanban, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  User,
  Zap,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '@/lib/store';

export function Sidebar() {
  const pathname = usePathname();
  const { accounts, resumes, applications } = useApp();

  const links = [
    { href: '/', label: 'Обзор', icon: LayoutDashboard },
    { href: '/hh', label: 'Наш hh.ru', icon: Building2, badge: `${accounts.length} акк.` },
    { href: '/telegram', label: 'Telegram Каналы', icon: Send, badge: '6 каналов' },
    { href: '/resumes', label: 'Мои Резюме', icon: FileText, badge: `${resumes.length} версии` },
    { href: '/kanban', label: 'Канбан', icon: Kanban, badge: `${applications.length}` },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#09090b] flex flex-col justify-between shrink-0 select-none min-h-screen">
      {/* Top Header */}
      <div>
        <div className="h-14 border-b border-zinc-800 px-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-xs">
              <Zap className="w-4 h-4 fill-current text-zinc-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">ORCA</span>
              <span className="text-zinc-500 text-xs font-mono">/ hub</span>
            </div>
          </Link>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            v2.0
          </span>
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Навигация
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800/90 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* HH Accounts quick switcher */}
        <div className="p-3 pt-2">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
            <span>Аккаунты hh.ru</span>
            <Link href="/hh" className="text-zinc-400 hover:text-zinc-200">
              <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-1">
            {accounts.map((acc, i) => (
              <Link
                key={acc.id}
                href="/hh"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="truncate">{acc.name}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">4ч</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-zinc-800">
        <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-semibold">
              ВА
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-200 leading-tight">Вадим Анохин</div>
              <div className="text-[10px] text-zinc-500">Frontend / Fullstack</div>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500" title="Воркер авто-поднятия активен" />
        </div>
      </div>
    </aside>
  );
}
