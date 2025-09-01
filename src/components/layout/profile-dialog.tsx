'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UserProfile } from '@clerk/nextjs';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const t = useTranslations('profile');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-full justify-center border-0 bg-transparent p-0 shadow-none'>
        <div className='relative'>
          <Button
            variant='ghost'
            size='icon'
            className='bg-background/80 hover:bg-background/90 absolute top-4 right-4 z-50 h-8 w-8 rounded-full backdrop-blur-sm'
            onClick={() => onOpenChange(false)}
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>{t('close')}</span>
          </Button>
          <UserProfile />
        </div>
      </DialogContent>
    </Dialog>
  );
}
