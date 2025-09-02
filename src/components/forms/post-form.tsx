'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { CreatePostInput, UpdatePostInput } from '@/types/post';

/**
 * Schema de validação para formulário de post
 */
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  published: z.boolean().optional()
});

type PostFormData = z.infer<typeof postSchema>;

/**
 * Props do componente PostForm
 */
interface PostFormProps {
  initialData?: UpdatePostInput;
  onSubmit: (data: {
    title: string;
    content?: string;
    published?: boolean;
  }) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

/**
 * Componente de formulário para criação/edição de posts
 * Responsável por capturar dados do post e validar entrada
 */
export function PostForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel
}: PostFormProps) {
  const t = useTranslations('posts');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      published: initialData?.published || false
    }
  });

  const isPublished = watch('published');

  /**
   * Manipula o envio do formulário
   */
  const handleFormSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      {/* Title */}
      <div className='space-y-2'>
        <Label htmlFor='title'>{t('form.title')}</Label>
        <Input
          id='title'
          {...register('title')}
          placeholder={t('form.titlePlaceholder')}
        />
        {errors.title && (
          <p className='text-sm text-red-500'>{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className='space-y-2'>
        <Label htmlFor='content'>{t('form.content')}</Label>
        <Textarea
          id='content'
          {...register('content')}
          placeholder={t('form.contentPlaceholder')}
          rows={6}
        />
        {errors.content && (
          <p className='text-sm text-red-500'>{errors.content.message}</p>
        )}
      </div>

      {/* Published */}
      <div className='flex items-center space-x-2'>
        <Switch
          id='published'
          checked={isPublished}
          onCheckedChange={(checked) => setValue('published', checked)}
        />
        <Label htmlFor='published'>{t('form.published')}</Label>
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
  );
}
