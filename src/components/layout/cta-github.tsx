import React from 'react';
import { Button } from '@/components/ui/button';
import { IconBrandGithub } from '@tabler/icons-react';

export default function CtaGithub() {
  return (
    <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
      <a
        href='https://github.com/isaacdalmarco/next-shadcn-clerk'
        rel='noopener noreferrer'
        target='_blank'
        className='dark:text-foreground'
      >
        <IconBrandGithub />
      </a>
    </Button>
  );
}
