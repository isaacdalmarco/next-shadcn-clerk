export function LoadingSpinner() {
  return (
    <div className='text-center'>
      <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
      <p className='text-muted-foreground'>Carregando...</p>
    </div>
  );
}
