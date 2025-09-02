'use client';

import { useState } from 'react';
import { TaskList } from '@/components/lists/task-list';
import { TaskForm } from '@/components/forms/task-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { UpdateTaskInput } from '@/types/task';
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks';
import { Task } from '@/types/task';

export function TasksPageClient() {
  const t = useTranslations('tasks');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    status: string;
  }) => {
    try {
      await createTaskMutation.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async (data: UpdateTaskInput) => {
    if (!editingTask?.id) return;

    try {
      await updateTaskMutation.mutateAsync({ id: editingTask.id, data });
      setIsEditDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('page.title')}</h1>
          <p className='text-gray-600'>{t('page.description')}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          {t('list.createButton')}
        </Button>
      </div>

      <TaskList onEdit={handleEditClick} />

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            isLoading={createTaskMutation.isPending}
            submitLabel={t('form.createSubmit')}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('dialog.editTitle')}</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              initialData={{
                ...editingTask,
                description: editingTask.description || undefined,
                columnId: editingTask.columnId || undefined
              }}
              onSubmit={handleEditTask}
              isLoading={updateTaskMutation.isPending}
              submitLabel={t('form.updateSubmit')}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
