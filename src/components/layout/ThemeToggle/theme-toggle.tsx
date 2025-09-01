'use client';

import { IconBrightness } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  compact?: boolean;
}

export function ModeToggle({ compact = false }: ModeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [resolvedTheme, setTheme]
  );

  if (compact) {
    return (
      <Button
        variant='outline'
        size='sm'
        className='h-8 w-full justify-start text-xs'
        onClick={handleThemeToggle}
      >
        <IconBrightness className='mr-2 h-3 w-3' />
        {resolvedTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
      </Button>
    );
  }

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={handleThemeToggle}
    >
      <IconBrightness />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
