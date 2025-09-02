'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useCreateTask, useColumns } from '@/hooks/use-tasks';

export default function NewTaskDialog() {
  const t = useTranslations('tasks');
  const [isOpen, setIsOpen] = useState(false);
  const createTaskMutation = useCreateTask();
  const { data: columns, isLoading: columnsLoading } = useColumns();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title, description, columnId } = Object.fromEntries(formData);

    if (typeof title !== 'string') return;

    // Se não foi selecionada uma coluna, usar a primeira coluna disponível
    let selectedColumnId = typeof columnId === 'string' ? columnId : '';
    if (!selectedColumnId && columns && columns.length > 0) {
      // Ordenar colunas por ordem e pegar a primeira
      const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
      selectedColumnId = sortedColumns[0].id;
    }

    try {
      await createTaskMutation.mutateAsync({
        title,
        description: typeof description === 'string' ? description : undefined,
        status: 'TODO',
        columnId: selectedColumnId
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm'>
          ＋ {t('kanban.addTask')}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{t('kanban.addTask')}</DialogTitle>
          <DialogDescription>{t('kanban.description')}</DialogDescription>
        </DialogHeader>
        <form
          id='todo-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='title' className='text-right'>
              {t('form.titleField')}
            </Label>
            <Input
              id='title'
              name='title'
              placeholder={t('form.titlePlaceholder')}
              className='col-span-3'
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              {t('form.description')}
            </Label>
            <Textarea
              id='description'
              name='description'
              placeholder={t('form.descriptionPlaceholder')}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='columnId' className='text-right'>
              {t('form.column')}
            </Label>
            <Select name='columnId'>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder={t('form.columnPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {columnsLoading ? (
                  <SelectItem value='' disabled>
                    {t('common.loading')}
                  </SelectItem>
                ) : (
                  columns?.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button
            type='submit'
            size='sm'
            form='todo-form'
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending
              ? t('form.submitting')
              : t('form.createSubmit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
