'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CreateOrganization } from '@clerk/nextjs';
import { IconBuilding } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function FirstLoginSetup() {
  const t = useTranslations('organization');

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <IconBuilding className='text-primary h-8 w-8' />
          </div>
          <CardTitle className='text-2xl'>{t('firstLoginSetup')}</CardTitle>
          <CardDescription>{t('firstLoginSetupDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganization />
        </CardContent>
      </Card>
    </div>
  );
}
