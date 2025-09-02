'use server';

import {
  ProductService,
  CreateProductData,
  UpdateProductData
} from '@/services/product-service';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function getProducts() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await ProductService.getAllProducts(orgId);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await ProductService.getProductById(id, orgId);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function createProduct(
  data: Omit<CreateProductData, 'authorId' | 'organizationId'>
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const product = await ProductService.createProduct({
      ...data,
      authorId: userId,
      organizationId: orgId
    });

    revalidatePath('/dashboard/product');
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create product'
    );
  }
}

export async function updateProduct(id: string, data: UpdateProductData) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const product = await ProductService.updateProduct(id, orgId, data);
    revalidatePath('/dashboard/product');
    revalidatePath(`/dashboard/product/${id}`);
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update product'
    );
  }
}

export async function deleteProduct(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    await ProductService.deleteProduct(id, orgId);
    revalidatePath('/dashboard/product');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete product'
    );
  }
}

export async function getProductsByAuthor(authorId: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await ProductService.getProductsByAuthor(authorId, orgId);
  } catch (error) {
    console.error('Error fetching products by author:', error);
    throw new Error('Failed to fetch products by author');
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await ProductService.getProductsByCategory(category, orgId);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
}
