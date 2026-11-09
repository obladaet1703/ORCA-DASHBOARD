'use client';

import React from 'react';
import { TopNav } from '@/components/TopNav';
import { useApp } from '@/lib/store';
import { KanbanBoard } from '@/components/KanbanBoard';

export default function KanbanPage() {
  const { applications, updateApplicationStatus, deleteApplication } = useApp();

  return (
    <div className="flex-1 flex flex-col bg-[#09090b]">
      <TopNav 
        title="Канбан Доска" 
        subtitle="Отслеживание этапов откликов и статусов собеседований" 
      />

      <main className="p-6 max-w-7xl w-full mx-auto">
        <KanbanBoard
          vacancies={applications}
          onUpdateStatus={updateApplicationStatus}
          onUpdateNotes={(id, notes) => {}}
          onDelete={deleteApplication}
          onOpenAI={() => {}}
        />
      </main>
    </div>
  );
}
