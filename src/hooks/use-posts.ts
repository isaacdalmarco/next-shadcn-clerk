import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor
} from '@/actions/post-actions';
import { UpdatePostData } from '@/services/post-service';
import { useOrganization } from '@clerk/nextjs';

/**
 * Hook para listar todos os posts da organização
 */
export function usePosts() {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['posts', organization?.id],
    queryFn: getPosts,
    enabled: !!organization?.id
  });
}

/**
 * Hook para buscar post por ID
 */
export function usePost(id: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['posts', id, organization?.id],
    queryFn: () => getPostById(id),
    enabled: !!id && !!organization?.id
  });
}

/**
 * Hook para listar posts por autor
 */
export function usePostsByAuthor(authorId: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['posts', 'author', authorId, organization?.id],
    queryFn: () => getPostsByAuthor(authorId),
    enabled: !!authorId && !!organization?.id
  });
}

/**
 * Hook para criar post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (data: {
      title: string;
      content?: string;
      published?: boolean;
    }) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', organization?.id] });
    }
  });
}

/**
 * Hook para atualizar post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) =>
      updatePost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['posts', organization?.id] });
      queryClient.invalidateQueries({
        queryKey: ['posts', id, organization?.id]
      });
    }
  });
}

/**
 * Hook para deletar post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', organization?.id] });
    }
  });
}
