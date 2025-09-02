import { Suspense } from 'react';
import { TasksPageClient } from './tasks-page-client';

export default function TasksPage() {
  return (
    <div className='container mx-auto space-y-6 py-6'>
      <Suspense fallback={<div>Loading...</div>}>
        <TasksPageClient />
      </Suspense>
    </div>
  );
}
