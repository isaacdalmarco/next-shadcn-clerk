'use client';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { OrganizationList } from '@clerk/nextjs';
import { FirstLoginSetup } from './first-login-setup';
import { useTranslations } from 'next-intl';

export function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const t = useTranslations('organization');

  // Aguarda os hooks carregarem
  if (!orgLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground'>{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Se o usuário não tem organizações, mostra a tela de primeiro login
  if (!organization?.name) {
    return <FirstLoginSetup />;
  }

  // Se o usuário tem organizações mas nenhuma está ativa, mostra a lista para seleção
  if (!organization) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-4'>
          <h1 className='text-center text-2xl font-bold'>
            {t('selectOrganization')}
          </h1>
          <p className='text-muted-foreground text-center'>
            {t('chooseOrganization')}
          </p>
          <OrganizationList />
        </div>
      </div>
    );
  }

  // Se tudo estiver configurado, mostra o conteúdo normal
  return <>{children}</>;
}
