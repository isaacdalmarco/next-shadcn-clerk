'use server';

import {
  PostService,
  CreatePostData,
  UpdatePostData
} from '@/services/post-service';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

/**
 * Server Action para listar todos os posts da organização
 */
export async function getPosts() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await PostService.getAllPosts(orgId);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

/**
 * Server Action para buscar post por ID
 */
export async function getPostById(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await PostService.getPostById(id, orgId);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
}

/**
 * Server Action para criar post
 */
export async function createPost(
  data: Omit<CreatePostData, 'authorId' | 'organizationId'>
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const post = await PostService.createPost({
      ...data,
      authorId: userId,
      organizationId: orgId
    });

    revalidatePath('/dashboard/posts');
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create post'
    );
  }
}

/**
 * Server Action para atualizar post
 */
export async function updatePost(id: string, data: UpdatePostData) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const post = await PostService.updatePost(id, orgId, data);
    revalidatePath('/dashboard/posts');
    revalidatePath(`/dashboard/posts/${id}`);
    return post;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update post'
    );
  }
}

/**
 * Server Action para deletar post
 */
export async function deletePost(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    await PostService.deletePost(id, orgId);
    revalidatePath('/dashboard/posts');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete post'
    );
  }
}

/**
 * Server Action para listar posts por autor
 */
export async function getPostsByAuthor(authorId: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await PostService.getPostsByAuthor(authorId, orgId);
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    throw new Error('Failed to fetch posts by author');
  }
}
