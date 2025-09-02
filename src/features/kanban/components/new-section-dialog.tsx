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
import { useTranslations } from 'next-intl';
import { useCreateColumn } from '@/hooks/use-tasks';
import { ColorPicker } from '@/components/ui/color-picker';

export default function NewSectionDialog() {
  const t = useTranslations('tasks');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const createColumnMutation = useCreateColumn();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title } = Object.fromEntries(formData);

    if (typeof title !== 'string') return;

    try {
      await createColumnMutation.mutateAsync({
        title,
        color: selectedColor,
        order: 0
      });
      setIsOpen(false);
      form.reset();
      setSelectedColor('#3b82f6'); // Reset to default color
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='lg' className='w-full'>
          ＋ {t('kanban.addColumn')}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{t('kanban.addColumn')}</DialogTitle>
          <DialogDescription>{t('kanban.description')}</DialogDescription>
        </DialogHeader>
        <form
          id='section-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='space-y-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Input
                id='title'
                name='title'
                placeholder={t('form.titlePlaceholder')}
                className='col-span-4'
                required
              />
            </div>
            <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          </div>
        </form>
        <DialogFooter>
          <Button
            type='submit'
            size='sm'
            form='section-form'
            disabled={createColumnMutation.isPending}
          >
            {createColumnMutation.isPending
              ? t('form.submitting')
              : t('form.createSubmit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
