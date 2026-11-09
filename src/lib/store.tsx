'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResumeProfile, HHAccount, Vacancy } from './types';
import { INITIAL_RESUME_PROFILES, INITIAL_HH_ACCOUNTS, INITIAL_KANBAN_VACANCIES } from './mock-data';

export interface TelegramChannelItem {
  id: string;
  name: string;
  username: string;
  isPrivate?: boolean;
  inviteLink?: string;
  category: string;
}

export const USER_TELEGRAM_CHANNELS: TelegramChannelItem[] = [
  { id: 'tg-1', name: 'Senior Frontender', username: 'senior_frontender', category: 'Frontend / Senior' },
  { id: 'tg-2', name: 'JScript Jobs', username: 'JScript_jobs', category: 'JavaScript / React' },
  { id: 'tg-3', name: 'JS Dev Job', username: 'jsdevjob', category: 'Web & Fullstack' },
  { id: 'tg-4', name: 'React Jobs', username: 'job_react', category: 'React Ecosystem' },
  { id: 'tg-5', name: 'Frontend Jobs Вакансии', username: 'frontend_jobs_vakansii', category: 'Frontend Remote' },
  { id: 'tg-6', name: 'Private IT Hub', username: 'private_channel', isPrivate: true, inviteLink: 'https://t.me/+ucoAOCsXCwk3ZmFi', category: 'Exclusive Invites' },
];

interface AppContextType {
  // Resumes
  resumes: ResumeProfile[];
  addResume: (resume: Omit<ResumeProfile, 'id'>) => void;
  updateResume: (id: string, updated: Partial<ResumeProfile>) => void;
  deleteResume: (id: string) => void;

  // HH Accounts
  accounts: HHAccount[];
  activeAccountId: string;
  setActiveAccountId: (id: string) => void;
  addAccount: (account: Omit<HHAccount, 'id'>) => void;
  updateAccount: (accountId: string, data: Partial<HHAccount>) => void;
  updateAccountSession: (accountId: string, cookies: string) => void;
  deleteAccount: (accountId: string) => void;
  bumpResume: (accountId: string, resumeId: string) => Promise<boolean>;
  addResumeToAccount: (accountId: string, resume: { title: string; status: 'published' | 'hidden' }) => void;
  updateAccountStats: (accountId: string, stats: { 
    appliedCount: number; 
    interviewCount?: number; 
    waitingCount?: number; 
    discardCount?: number; 
    viewsCount: number; 
    impressionsCount: number; 
    invitationsCount: number 
  }) => void;
  syncFromBackend: () => Promise<boolean>;
  importFromJSON: (payload: any) => boolean;

  // Telegram channels
  channels: TelegramChannelItem[];

  // Kanban / Applications
  applications: Vacancy[];
  addApplication: (vacancy: Vacancy) => void;
  updateApplicationStatus: (id: string, status: any) => void;
  deleteApplication: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<ResumeProfile[]>(INITIAL_RESUME_PROFILES);
  const [accounts, setAccounts] = useState<HHAccount[]>(INITIAL_HH_ACCOUNTS);
  const [activeAccountId, setActiveAccountId] = useState<string>('hh-acc-1');
  const [channels] = useState<TelegramChannelItem[]>(USER_TELEGRAM_CHANNELS);
  const [applications, setApplications] = useState<Vacancy[]>(INITIAL_KANBAN_VACANCIES);

  // Persistence with robust schema migration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedResumes = localStorage.getItem('orca_resumes');
    if (savedResumes) try { setResumes(JSON.parse(savedResumes)); } catch (e) {}

    const savedAccounts = localStorage.getItem('orca_accounts');
    if (savedAccounts) {
      try {
        const parsed: any[] = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = parsed.map((acc, idx) => {
            const fallback = INITIAL_HH_ACCOUNTS[idx] || INITIAL_HH_ACCOUNTS[0];
            const accResumes = (acc.resumes && acc.resumes.length > 0) ? acc.resumes : fallback.resumes;

            // Фильтруем любые старые демо/фейковые отклики
            const realNegotiations = (acc.negotiations || []).filter((n: any) => !n.id?.startsWith('neg-') && n.company !== 'Mindbox');

            return {
              ...fallback,
              ...acc,
              statsBreakdown: acc.statsBreakdown || fallback.statsBreakdown,
              negotiations: realNegotiations,
              resumes: accResumes.map((r: any, rIdx: number) => {
                const fallbackResume = fallback.resumes[rIdx] || fallback.resumes[0];
                return {
                  ...fallbackResume,
                  ...r,
                  id: idx === 0 ? '0f2efd1dff1094692c0039ed1f7a365a487370' : r.id,
                  appliedCount: idx === 0 ? (r.appliedCount || fallbackResume.appliedCount || 101) : r.appliedCount,
                  interviewCount: idx === 0 ? (r.interviewCount ?? 4) : r.interviewCount,
                  waitingCount: idx === 0 ? (r.waitingCount ?? 73) : r.waitingCount,
                  discardCount: idx === 0 ? (r.discardCount ?? 24) : r.discardCount,
                  impressionsCount: idx === 0 ? 43 : (r.impressionsCount || 0),
                  viewsCount: idx === 0 ? 21 : (r.viewsCount || 0),
                  invitationsCount: idx === 0 ? (r.invitationsCount ?? 4) : (r.invitationsCount || 0),
                  recentViews: (r.recentViews || []).filter((v: any) => v.company !== 'Mindbox' && v.company !== 'Ozon FinTech'),
                };
              }),
            };
          });
          setAccounts(merged);
        } else {
          setAccounts(INITIAL_HH_ACCOUNTS);
        }
      } catch (e) {
        setAccounts(INITIAL_HH_ACCOUNTS);
      }
    } else {
      setAccounts(INITIAL_HH_ACCOUNTS);
    }

    const savedApps = localStorage.getItem('orca_applications');
    if (savedApps) try { setApplications(JSON.parse(savedApps)); } catch (e) {}

    // Автоматическая подтяжка реальных данных, сохраненных на бэкенде (/data/hh-data.json)
    fetch('/api/hh/import')
      .then((res) => res.json())
      .then((d) => {
        if (d && d.success && d.data) {
          const imported = d.data;
          setAccounts((prev) => {
            const exists = prev.some((a) => a.id === imported.id);
            const updated = exists
              ? prev.map((a) => (a.id === imported.id ? { ...a, ...imported } : a))
              : [imported, ...prev];
            localStorage.setItem('orca_accounts', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(() => {});
  }, []);

  const saveResumes = (data: ResumeProfile[]) => {
    setResumes(data);
    localStorage.setItem('orca_resumes', JSON.stringify(data));
  };

  const saveAccounts = (data: HHAccount[]) => {
    setAccounts(data);
    localStorage.setItem('orca_accounts', JSON.stringify(data));
  };

  const saveApplications = (data: Vacancy[]) => {
    setApplications(data);
    localStorage.setItem('orca_applications', JSON.stringify(data));
  };

  // Resume CRUD
  const addResume = (newRes: Omit<ResumeProfile, 'id'>) => {
    const id = `res-${Date.now()}`;
    const updated = [...resumes, { ...newRes, id }];
    saveResumes(updated);
  };

  const updateResume = (id: string, changes: Partial<ResumeProfile>) => {
    const updated = resumes.map((r) => (r.id === id ? { ...r, ...changes } : r));
    saveResumes(updated);
  };

  const deleteResume = (id: string) => {
    const updated = resumes.filter((r) => r.id !== id);
    saveResumes(updated);
  };

  // HH Account actions
  const addAccount = (acc: Omit<HHAccount, 'id'>) => {
    const id = `hh-acc-${Date.now()}`;
    const updated = [...accounts, { ...acc, id }];
    saveAccounts(updated);
  };

  const updateAccount = (accountId: string, data: Partial<HHAccount>) => {
    const updated = accounts.map((acc) => (acc.id === accountId ? { ...acc, ...data } : acc));
    saveAccounts(updated);
  };

  const deleteAccount = (accountId: string) => {
    const updated = accounts.filter((a) => a.id !== accountId);
    saveAccounts(updated);
    if (activeAccountId === accountId && updated.length > 0) {
      setActiveAccountId(updated[0].id);
    }
  };

  const updateAccountSession = (accountId: string, cookies: string) => {
    const updated = accounts.map((acc) => {
      if (acc.id === accountId) {
        return {
          ...acc,
          status: 'connected' as const,
          credentialsMasked: `hhtoken=***${cookies.slice(-6)} (Обновлено)`,
          lastCheckedAt: new Date().toISOString(),
        };
      }
      return acc;
    });
    saveAccounts(updated);
  };

  const updateAccountStats = (accountId: string, stats: { 
    appliedCount: number; 
    interviewCount?: number; 
    waitingCount?: number; 
    discardCount?: number; 
    viewsCount: number; 
    impressionsCount: number; 
    invitationsCount: number 
  }) => {
    const updated = accounts.map((acc) => {
      if (acc.id === accountId) {
        return {
          ...acc,
          statsBreakdown: {
            all: stats.appliedCount,
            interview: stats.interviewCount ?? 4,
            waiting: stats.waitingCount ?? 73,
            discard: stats.discardCount ?? 24,
            invitation: stats.invitationsCount ?? 0,
            deleted: acc.statsBreakdown?.deleted ?? 42,
          },
          resumes: acc.resumes.map((r, idx) => {
            if (idx === 0) {
              return {
                ...r,
                appliedCount: stats.appliedCount,
                interviewCount: stats.interviewCount ?? r.interviewCount,
                waitingCount: stats.waitingCount ?? r.waitingCount,
                discardCount: stats.discardCount ?? r.discardCount,
                viewsCount: stats.viewsCount,
                impressionsCount: stats.impressionsCount,
                invitationsCount: stats.invitationsCount,
              };
            }
            return r;
          }),
        };
      }
      return acc;
    });
    saveAccounts(updated);
  };

  const syncFromBackend = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/hh/import');
      const d = await res.json();
      if (d && d.success && d.data) {
        const imported = d.data;
        const exists = accounts.some((a) => a.id === imported.id);
        const updated = exists
          ? accounts.map((a) => (a.id === imported.id ? { ...a, ...imported } : a))
          : [imported, ...accounts];
        saveAccounts(updated);
        return true;
      }
    } catch (e) {
      console.error('syncFromBackend error:', e);
    }
    return false;
  };

  const importFromJSON = (payload: any): boolean => {
    try {
      const imported = payload.account || payload;
      if (!imported || !imported.resumes) return false;
      const targetId = imported.id || 'hh-acc-1';
      const exists = accounts.some((a) => a.id === targetId);
      const updated = exists
        ? accounts.map((a) => (a.id === targetId ? { ...a, ...imported } : a))
        : [imported, ...accounts];
      saveAccounts(updated);
      return true;
    } catch (e) {
      console.error('importFromJSON error:', e);
      return false;
    }
  };

  const bumpResume = async (accountId: string, resumeId: string): Promise<boolean> => {
    try {
      await fetch('/api/hh/bump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, resumeId }),
      });

      const updated = accounts.map((acc) => {
        if (acc.id === accountId) {
          return {
            ...acc,
            resumes: acc.resumes.map((r) => {
              if (r.id === resumeId) {
                return {
                  ...r,
                  lastBumpedAt: new Date().toISOString(),
                  nextBumpAvailableAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                };
              }
              return r;
            }),
          };
        }
        return acc;
      });

      saveAccounts(updated);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addResumeToAccount = (accountId: string, newResume: { title: string; status: 'published' | 'hidden' }) => {
    const updated = accounts.map((acc) => {
      if (acc.id === accountId) {
        return {
          ...acc,
          resumes: [
            ...acc.resumes,
            {
              id: `hh-res-${Date.now()}`,
              title: newResume.title,
              status: newResume.status,
              viewsCount: 0,
              impressionsCount: 0,
              invitationsCount: 0,
              lastBumpedAt: new Date().toISOString(),
              nextBumpAvailableAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
              recentViews: [],
            },
          ],
        };
      }
      return acc;
    });
    saveAccounts(updated);
  };

  // Kanban CRUD
  const addApplication = (vacancy: Vacancy) => {
    const updated = [vacancy, ...applications.filter((a) => a.id !== vacancy.id)];
    saveApplications(updated);
  };

  const updateApplicationStatus = (id: string, status: any) => {
    const updated = applications.map((a) => (a.id === id ? { ...a, status } : a));
    saveApplications(updated);
  };

  const deleteApplication = (id: string) => {
    const updated = applications.filter((a) => a.id !== id);
    saveApplications(updated);
  };

  return (
    <AppContext.Provider
      value={{
        resumes,
        addResume,
        updateResume,
        deleteResume,
        accounts,
        activeAccountId,
        setActiveAccountId,
        addAccount,
        updateAccount,
        updateAccountSession,
        deleteAccount,
        bumpResume,
        addResumeToAccount,
        updateAccountStats,
        syncFromBackend,
        importFromJSON,
        channels,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
