import { prisma } from '@/lib/prisma';
import { Post } from '@prisma/client';

/**
 * Interface para criação de post
 */
export interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
  organizationId: string;
}

/**
 * Interface para atualização de post
 */
export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

/**
 * Serviço para operações de post
 * Responsável por gerenciar todas as operações CRUD de posts
 */
export class PostService {
  /**
   * Lista todos os posts de uma organização
   */
  static async getAllPosts(organizationId: string): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Busca um post por ID dentro de uma organização
   */
  static async getPostById(
    id: string,
    organizationId: string
  ): Promise<Post | null> {
    return prisma.post.findFirst({
      where: {
        id,
        organizationId
      }
    });
  }

  /**
   * Cria um novo post
   */
  static async createPost(data: CreatePostData): Promise<Post> {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published || false,
        authorId: data.authorId,
        organizationId: data.organizationId
      }
    });
  }

  /**
   * Atualiza um post existente dentro de uma organização
   */
  static async updatePost(
    id: string,
    organizationId: string,
    data: UpdatePostData
  ): Promise<Post> {
    // Verificar se o post existe na organização
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    return prisma.post.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.published !== undefined && { published: data.published })
      }
    });
  }

  /**
   * Deleta um post dentro de uma organização
   */
  static async deletePost(id: string, organizationId: string): Promise<void> {
    // Verificar se o post existe na organização
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    await prisma.post.delete({
      where: { id }
    });
  }

  /**
   * Lista posts por autor dentro de uma organização
   */
  static async getPostsByAuthor(
    authorId: string,
    organizationId: string
  ): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        authorId,
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
