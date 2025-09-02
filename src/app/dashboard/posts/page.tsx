import { Suspense } from 'react';
import { PostsPageClient } from './posts-page-client';

/**
 * Página de gerenciamento de posts
 * Responsável por exibir lista de posts e permitir CRUD
 */
export default function PostsPage() {
  return (
    <div className='flex flex-1 flex-col space-y-6 p-4 md:px-6'>
      <Suspense fallback={<div>Loading...</div>}>
        <PostsPageClient />
      </Suspense>
    </div>
  );
}
