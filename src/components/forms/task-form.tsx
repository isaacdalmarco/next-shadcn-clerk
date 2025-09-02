'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { UpdateTaskInput } from '@/types/task';
import { useColumns } from '@/hooks/use-tasks';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  columnId: z.string().optional()
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: UpdateTaskInput;
  onSubmit: (data: {
    title: string;
    description?: string;
    status: string;
    columnId?: string;
  }) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function TaskForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel
}: TaskFormProps) {
  const t = useTranslations('tasks');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: columns, isLoading: columnsLoading } = useColumns();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'TODO',
      columnId: initialData?.columnId || ''
    }
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>{t('form.title')}</CardTitle>
        <CardDescription>{t('form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>{t('form.titleField')}</Label>
            <Input
              id='title'
              {...register('title')}
              placeholder={t('form.titlePlaceholder')}
            />
            {errors.title && (
              <p className='text-sm text-red-500'>{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>{t('form.description')}</Label>
            <Textarea
              id='description'
              {...register('description')}
              placeholder={t('form.descriptionPlaceholder')}
              rows={4}
            />
            {errors.description && (
              <p className='text-sm text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <Label htmlFor='status'>{t('form.status')}</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TODO'>Todo</SelectItem>
                <SelectItem value='IN_PROGRESS'>In Progress</SelectItem>
                <SelectItem value='DONE'>Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className='text-sm text-red-500'>{errors.status.message}</p>
            )}
          </div>

          {/* Column */}
          <div className='space-y-2'>
            <Label htmlFor='columnId'>{t('form.column')}</Label>
            <Select
              value={watch('columnId')}
              onValueChange={(value) => setValue('columnId', value)}
            >
              <SelectTrigger>
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
            {errors.columnId && (
              <p className='text-sm text-red-500'>{errors.columnId.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting
              ? t('form.submitting')
              : submitLabel || t('form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
