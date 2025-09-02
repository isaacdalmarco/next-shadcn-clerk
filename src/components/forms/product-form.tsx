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
import { UpdateProductInput } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  photoUrl: z.string().url().optional().or(z.literal(''))
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: UpdateProductInput;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    category: string;
    photoUrl?: string;
  }) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel
}: ProductFormProps) {
  const t = useTranslations('products');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category: initialData?.category || '',
      photoUrl: initialData?.photoUrl || ''
    }
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      {/* Name */}
      <div className='space-y-2'>
        <Label htmlFor='name'>{t('form.name')}</Label>
        <Input
          id='name'
          {...register('name')}
          placeholder={t('form.namePlaceholder')}
        />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
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
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div className='space-y-2'>
        <Label htmlFor='price'>{t('form.price')}</Label>
        <Input
          id='price'
          type='number'
          step='0.01'
          {...register('price', { valueAsNumber: true })}
          placeholder={t('form.pricePlaceholder')}
        />
        {errors.price && (
          <p className='text-sm text-red-500'>{errors.price.message}</p>
        )}
      </div>

      {/* Category */}
      <div className='space-y-2'>
        <Label htmlFor='category'>{t('form.category')}</Label>
        <Select
          value={watch('category')}
          onValueChange={(value) => setValue('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('form.categoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Electronics'>Electronics</SelectItem>
            <SelectItem value='Furniture'>Furniture</SelectItem>
            <SelectItem value='Clothing'>Clothing</SelectItem>
            <SelectItem value='Toys'>Toys</SelectItem>
            <SelectItem value='Groceries'>Groceries</SelectItem>
            <SelectItem value='Books'>Books</SelectItem>
            <SelectItem value='Jewelry'>Jewelry</SelectItem>
            <SelectItem value='Beauty Products'>Beauty Products</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className='text-sm text-red-500'>{errors.category.message}</p>
        )}
      </div>

      {/* Photo URL */}
      <div className='space-y-2'>
        <Label htmlFor='photoUrl'>{t('form.photoUrl')}</Label>
        <Input
          id='photoUrl'
          {...register('photoUrl')}
          placeholder={t('form.photoUrlPlaceholder')}
        />
        {errors.photoUrl && (
          <p className='text-sm text-red-500'>{errors.photoUrl.message}</p>
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
  );
}
