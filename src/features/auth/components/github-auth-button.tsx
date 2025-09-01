'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useTranslations } from 'next-intl';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const t = useTranslations('auth');

  return (
    <Button
      className='w-full'
      variant='outline'
      type='button'
      onClick={() => console.log('continue with github clicked')}
    >
      <Icons.github className='mr-2 h-4 w-4' />
      {t('continueWithGithub')}
    </Button>
  );
}
