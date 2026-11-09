'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FunnelDashboard } from '@/components/FunnelDashboard';
import { VacancyFeed } from '@/components/VacancyFeed';
import { KanbanBoard } from '@/components/KanbanBoard';
import { ResumePersonaManager } from '@/components/ResumePersonaManager';
import { AccountsManager } from '@/components/AccountsManager';
import { AICoverLetterModal } from '@/components/AICoverLetterModal';
import { 
  INITIAL_HH_ACCOUNTS, 
  INITIAL_KANBAN_VACANCIES 
} from '@/lib/mock-data';
import { Vacancy, ApplicationStatus, HHAccount } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePersona, setActivePersona] = useState<'frontend' | 'fullstack'>('frontend');
  const [accounts, setAccounts] = useState<HHAccount[]>(INITIAL_HH_ACCOUNTS);
  const [kanbanVacancies, setKanbanVacancies] = useState<Vacancy[]>(INITIAL_KANBAN_VACANCIES);
  const [isBumping, setIsBumping] = useState(false);
  const [selectedVacancyForAI, setSelectedVacancyForAI] = useState<Vacancy | null>(null);

  // Сохранение и восстановление из localStorage
  useEffect(() => {
    const savedKanban = localStorage.getItem('job_hunt_kanban');
    if (savedKanban) {
      try {
        setKanbanVacancies(JSON.parse(savedKanban));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveKanban = (updated: Vacancy[]) => {
    setKanbanVacancies(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('job_hunt_kanban', JSON.stringify(updated));
    }
  };

  // Добавление вакансии в Канбан
  const handleAddToKanban = (vacancy: Vacancy) => {
    const newEntry: Vacancy = {
      ...vacancy,
      status: 'applied',
      appliedWithResumeId: activePersona === 'frontend' ? 'res-frontend' : 'res-fullstack',
      appliedDate: new Date().toISOString().split('T')[0],
      accountUsed: activePersona === 'frontend' ? 'Аккаунт №1 (Frontend)' : 'Аккаунт №2 (Fullstack)',
    };
    const updated = [newEntry, ...kanbanVacancies.filter((v) => v.id !== vacancy.id)];
    saveKanban(updated);
  };

  // Обновление статуса в Канбане
  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    const updated = kanbanVacancies.map((v) => 
      v.id === id ? { ...v, status: newStatus } : v
    );
    saveKanban(updated);
  };

  // Обновление заметки
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = kanbanVacancies.map((v) => 
      v.id === id ? { ...v, notes } : v
    );
    saveKanban(updated);
  };

  // Удаление из Канбана
  const handleDeleteKanban = (id: string) => {
    const updated = kanbanVacancies.filter((v) => v.id !== id);
    saveKanban(updated);
  };

  // Поднятие всех резюме
  const handleBumpAll = async () => {
    setIsBumping(true);
    try {
      for (const acc of accounts) {
        for (const res of acc.resumes) {
          await fetch('/api/hh/bump', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accountId: acc.id,
              resumeId: res.id,
            }),
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBumping(false);
    }
  };

  // Поднятие конкретного резюме
  const handleBumpAccount = async (accountId: string, resumeId: string) => {
    try {
      await fetch('/api/hh/bump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          resumeId,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePersona={activePersona}
        setActivePersona={setActivePersona}
        accounts={accounts}
        onBumpAll={handleBumpAll}
        isBumping={isBumping}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <FunnelDashboard />}

        {activeTab === 'vacancies' && (
          <VacancyFeed
            onAddToKanban={handleAddToKanban}
            activePersona={activePersona}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard
            vacancies={kanbanVacancies}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            onDelete={handleDeleteKanban}
            onOpenAI={(v) => setSelectedVacancyForAI(v)}
          />
        )}

        {activeTab === 'resumes' && <ResumePersonaManager />}

        {activeTab === 'accounts' && (
          <AccountsManager
            accounts={accounts}
            onBumpAccount={handleBumpAccount}
          />
        )}
      </main>

      {/* Global AI Modal if opened from Kanban */}
      <AICoverLetterModal
        isOpen={!!selectedVacancyForAI}
        onClose={() => setSelectedVacancyForAI(null)}
        vacancy={selectedVacancyForAI}
        activeProfileType={activePersona}
      />
    </div>
  );
}
