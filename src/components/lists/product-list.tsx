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
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { Product } from '@/types/product';
import { Trash2, Edit, Package } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

/**
 * Props do componente ProductList
 */
interface ProductListProps {
  onEdit?: (product: Product) => void;
}

/**
 * Componente de lista de produtos
 * Responsável por exibir todos os produtos em formato de cards
 */
export function ProductList({ onEdit }: ProductListProps) {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: products, isLoading, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();
  const { user } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  /**
   * Abre o dialog de confirmação de exclusão
   */
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirma a exclusão do produto
   */
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
    } catch (error) {
      console.error('Error deleting product:', error);
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
   * Formata o preço para exibição
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
      {products && products.length > 0 ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => (
            <Card
              key={product.id}
              className='transition-shadow hover:shadow-md'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='min-w-0 flex-1'>
                    <CardTitle className='line-clamp-2 text-lg'>
                      {product.name}
                    </CardTitle>
                    <CardDescription className='mt-1'>
                      {formatDate(product.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge variant='outline' className='ml-2'>
                    <Package className='mr-1 h-3 w-3' />
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='space-y-3'>
                  {product.description && (
                    <p className='line-clamp-3 text-sm text-gray-600'>
                      {truncateText(product.description)}
                    </p>
                  )}

                  <div className='flex items-center justify-between'>
                    <span className='text-lg font-semibold text-green-600'>
                      {formatPrice(product.price)}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {t('list.authorId')}: {getAuthorName(product.authorId)}
                    </span>
                  </div>

                  {product.photoUrl && (
                    <div className='mt-2'>
                      <img
                        src={product.photoUrl}
                        alt={product.name}
                        className='h-32 w-full rounded object-cover'
                      />
                    </div>
                  )}

                  <div className='flex space-x-2'>
                    {onEdit && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onEdit(product)}
                        className='flex-1'
                      >
                        <Edit className='mr-1 h-4 w-4' />
                        {t('list.edit')}
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteClick(product)}
                      disabled={deleteProductMutation.isPending}
                      className='flex-1'
                    >
                      <Trash2 className='mr-1 h-4 w-4' />
                      {t('list.delete')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
        description={`"${productToDelete?.name}"`}
        confirmText={t('list.delete')}
        cancelText={tCommon('cancel')}
        loadingText={tCommon('deleting')}
        onConfirm={handleConfirmDelete}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
}
