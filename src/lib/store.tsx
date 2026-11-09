'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResumeProfile, HHAccount, Vacancy } from './types';
import { INITIAL_RESUME_PROFILES, INITIAL_HH_ACCOUNTS, INITIAL_KANBAN_VACANCIES } from './mock-data';

export interface TelegramChannelItem {
  id: string;
  name: string;
  username: string; // handle or invite hash
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
  updateAccountSession: (accountId: string, cookies: string) => void;
  bumpResume: (accountId: string, resumeId: string) => Promise<boolean>;
  addResumeToAccount: (accountId: string, resume: { title: string; status: 'published' | 'hidden' }) => void;

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

  // Persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedResumes = localStorage.getItem('orca_resumes');
    if (savedResumes) try { setResumes(JSON.parse(savedResumes)); } catch (e) {}

    const savedAccounts = localStorage.getItem('orca_accounts');
    if (savedAccounts) try { setAccounts(JSON.parse(savedAccounts)); } catch (e) {}

    const savedApps = localStorage.getItem('orca_applications');
    if (savedApps) try { setApplications(JSON.parse(savedApps)); } catch (e) {}
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
                  viewsCount: (r.viewsCount || 0) + 1,
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
              lastBumpedAt: new Date().toISOString(),
              nextBumpAvailableAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
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
        updateAccountSession,
        bumpResume,
        addResumeToAccount,
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
