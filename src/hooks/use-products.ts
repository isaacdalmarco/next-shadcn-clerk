import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByAuthor,
  getProductsByCategory
} from '@/actions/product-actions';
import { UpdateProductData } from '@/services/product-service';
import { useOrganization } from '@clerk/nextjs';

export function useProducts() {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['products', organization?.id],
    queryFn: getProducts,
    enabled: !!organization?.id
  });
}

export function useProduct(id: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['products', id, organization?.id],
    queryFn: () => getProductById(id),
    enabled: !!id && !!organization?.id
  });
}

export function useProductsByAuthor(authorId: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['products', 'author', authorId, organization?.id],
    queryFn: () => getProductsByAuthor(authorId),
    enabled: !!authorId && !!organization?.id
  });
}

export function useProductsByCategory(category: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['products', 'category', category, organization?.id],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category && !!organization?.id
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      price: number;
      category: string;
      photoUrl?: string;
    }) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', organization?.id]
      });
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['products', organization?.id]
      });
      queryClient.invalidateQueries({
        queryKey: ['products', id, organization?.id]
      });
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', organization?.id]
      });
    }
  });
}
