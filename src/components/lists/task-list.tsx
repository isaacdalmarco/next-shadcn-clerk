'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTranslations, useLocale } from 'next-intl';
import { useTasks, useDeleteTask } from '@/hooks/use-tasks';
import { Task } from '@/types/task';
import { Trash2, Edit, CheckCircle, Circle, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

/**
 * Props do componente TaskList
 */
interface TaskListProps {
  onEdit?: (task: Task) => void;
}

/**
 * Componente de lista de tarefas
 * Responsável por exibir todas as tarefas em formato de cards
 */
export function TaskList({ onEdit }: TaskListProps) {
  const t = useTranslations('tasks');
  const locale = useLocale();
  const { data: tasks, isLoading, error } = useTasks();
  const deleteTaskMutation = useDeleteTask();
  const { user } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const tCommon = useTranslations('common');
  /**
   * Abre o dialog de confirmação de exclusão
   */
  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirma a exclusão da tarefa
   */
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTaskMutation.mutateAsync(taskToDelete.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  /**
   * Formata a data para exibição
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  /**
   * Trunca o texto para exibição
   */
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  /**
   * Obtém o nome do usuário baseado no authorId
   */
  const getAuthorName = (authorId: string) => {
    // Se for o usuário atual, usar os dados do Clerk
    if (user && user.id === authorId) {
      return (
        user.fullName ||
        user.firstName ||
        user.emailAddresses[0]?.emailAddress ||
        authorId
      );
    }
    // Para outros usuários, por enquanto mostrar o ID
    // Em uma implementação completa, você buscaria os dados do usuário no banco
    return authorId;
  };

  /**
   * Obtém o ícone e cor do status
   */
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'TODO':
        return {
          icon: Circle,
          color: 'bg-gray-100 text-gray-800',
          label: 'Todo'
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          color: 'bg-blue-100 text-blue-800',
          label: 'In Progress'
        };
      case 'DONE':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'Done'
        };
      default:
        return {
          icon: Circle,
          color: 'bg-gray-100 text-gray-800',
          label: status
        };
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardHeader>
                <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                <div className='h-3 w-1/2 rounded bg-gray-200'></div>
              </CardHeader>
              <CardContent>
                <div className='mb-2 h-3 w-full rounded bg-gray-200'></div>
                <div className='h-3 w-2/3 rounded bg-gray-200'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-8 text-center'>
        <p className='text-red-500'>{t('list.error')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {tasks && tasks.length > 0 ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={task.id} className='transition-shadow hover:shadow-md'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='min-w-0 flex-1'>
                      <CardTitle className='line-clamp-2 text-lg'>
                        {task.title}
                      </CardTitle>
                      <CardDescription className='mt-1'>
                        {formatDate(task.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 ${statusInfo.color}`}>
                      <StatusIcon className='mr-1 h-3 w-3' />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='space-y-3'>
                    {task.description && (
                      <p className='line-clamp-3 text-sm text-gray-600'>
                        {truncateText(task.description)}
                      </p>
                    )}

                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-500'>
                        {t('list.authorId')}: {getAuthorName(task.authorId)}
                      </span>
                    </div>

                    <div className='flex space-x-2'>
                      {onEdit && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onEdit(task)}
                          className='flex-1'
                        >
                          <Edit className='mr-1 h-4 w-4' />
                          {t('list.edit')}
                        </Button>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteClick(task)}
                        disabled={deleteTaskMutation.isPending}
                        className='flex-1'
                      >
                        <Trash2 className='mr-1 h-4 w-4' />
                        {t('list.delete')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className='py-8 text-center'>
          <p className='text-gray-500'>{t('list.empty')}</p>
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('list.confirmDelete')}
        description={`"${taskToDelete?.title}"`}
        confirmText={t('list.delete')}
        cancelText={tCommon('cancel')}
        loadingText={tCommon('deleting')}
        onConfirm={handleConfirmDelete}
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
}
