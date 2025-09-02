'use client';

import { useState } from 'react';
import { PostList } from '@/components/lists/post-list';
import { PostForm } from '@/components/forms/post-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { UpdatePostInput } from '@/types/post';
import { useCreatePost, useUpdatePost } from '@/hooks/use-posts';
import { Post } from '@prisma/client';

/**
 * Componente client da página de posts
 * Responsável por gerenciar estado e interações do usuário
 */
export function PostsPageClient() {
  const t = useTranslations('posts');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  /**
   * Manipula a criação de post
   */
  const handleCreatePost = async (data: {
    title: string;
    content?: string;
    published?: boolean;
  }) => {
    try {
      await createPostMutation.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  /**
   * Manipula a edição de post
   */
  const handleEditPost = async (data: UpdatePostInput) => {
    if (!editingPost?.id) return;

    try {
      await updatePostMutation.mutateAsync({ id: editingPost.id, data });
      setIsEditDialogOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  /**
   * Abre o diálogo de edição
   */
  const handleEditClick = (post: Post) => {
    setEditingPost(post);
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

      <PostList onEdit={handleEditClick} />

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
          </DialogHeader>
          <PostForm
            onSubmit={handleCreatePost}
            isLoading={createPostMutation.isPending}
            submitLabel={t('form.createSubmit')}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('dialog.editTitle')}</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <PostForm
              initialData={{
                ...editingPost,
                content: editingPost.content || undefined
              }}
              onSubmit={handleEditPost}
              isLoading={updatePostMutation.isPending}
              submitLabel={t('form.updateSubmit')}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
