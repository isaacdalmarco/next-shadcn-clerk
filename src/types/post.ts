import { Post } from '@prisma/client';

/**
 * Tipo para post com dados do autor do Clerk
 */
export type PostWithAuthor = Post & {
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
};

/**
 * Tipo para criação de post
 */
export interface CreatePostInput {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
  organizationId: string;
}

/**
 * Tipo para atualização de post
 */
export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
}
