import { Product } from '@prisma/client';

export type { Product };

export type ProductWithAuthor = Product & {
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
};

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  photoUrl?: string;
  authorId: string;
  organizationId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  photoUrl?: string;
}
