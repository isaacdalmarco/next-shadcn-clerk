import { Suspense } from 'react';
import { ProductsPageClient } from './products-page-client';

export default function ProductsPage() {
  return (
    <div className='flex flex-1 flex-col space-y-6 p-4 md:px-6'>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsPageClient />
      </Suspense>
    </div>
  );
}
