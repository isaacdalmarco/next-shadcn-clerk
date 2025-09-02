'use client';

import PageContainer from '@/components/layout/page-container';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';
import { useTranslations } from 'next-intl';

export default function KanbanViewPage() {
  const t = useTranslations('tasks');

  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>{t('kanban.title')}</h1>
            <p className='text-gray-600'>{t('kanban.description')}</p>
          </div>
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
    </PageContainer>
  );
}
