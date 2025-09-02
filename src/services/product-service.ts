import { prisma } from '@/lib/prisma';
import { Product } from '@prisma/client';

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category: string;
  photoUrl?: string;
  authorId: string;
  organizationId: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  photoUrl?: string;
}

export class ProductService {
  static async getAllProducts(organizationId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getProductById(
    id: string,
    organizationId: string
  ): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        id,
        organizationId
      }
    });
  }

  static async createProduct(data: CreateProductData): Promise<Product> {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        photoUrl: data.photoUrl,
        authorId: data.authorId,
        organizationId: data.organizationId
      }
    });
  }

  static async updateProduct(
    id: string,
    organizationId: string,
    data: UpdateProductData
  ): Promise<Product> {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.category && { category: data.category }),
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl })
      }
    });
  }

  static async deleteProduct(
    id: string,
    organizationId: string
  ): Promise<void> {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id }
    });
  }

  static async getProductsByAuthor(
    authorId: string,
    organizationId: string
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        authorId,
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getProductsByCategory(
    category: string,
    organizationId: string
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        category,
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
