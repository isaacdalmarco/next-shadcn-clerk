'use client';

import { useState } from 'react';
import { ProductList } from '@/components/lists/product-list';
import { ProductForm } from '@/components/forms/product-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { UpdateProductInput } from '@/types/product';
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import { Product } from '@/types/product';

export function ProductsPageClient() {
  const t = useTranslations('products');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const handleCreateProduct = async (data: {
    name: string;
    description?: string;
    price: number;
    category: string;
    photoUrl?: string;
  }) => {
    try {
      await createProductMutation.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = async (data: UpdateProductInput) => {
    if (!editingProduct?.id) return;

    try {
      await updateProductMutation.mutateAsync({ id: editingProduct.id, data });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
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

      <ProductList onEdit={handleEditClick} />

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            isLoading={createProductMutation.isPending}
            submitLabel={t('form.createSubmit')}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('dialog.editTitle')}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={{
                ...editingProduct,
                description: editingProduct.description || undefined,
                photoUrl: editingProduct.photoUrl || undefined
              }}
              onSubmit={handleEditProduct}
              isLoading={updateProductMutation.isPending}
              submitLabel={t('form.updateSubmit')}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
