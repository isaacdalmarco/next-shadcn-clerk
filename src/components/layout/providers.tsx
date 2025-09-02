'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { ptBR, enUS, esES } from '@clerk/localizations';
import { useLocale } from 'next-intl';
import { QueryProvider } from '../providers/query-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();
  const locale = useLocale();

  // Mapear locale do i18n para localização do Clerk
  const getClerkLocalization = (locale: string) => {
    switch (locale) {
      case 'pt-BR':
        return ptBR;
      case 'es':
        return esES;
      case 'en':
      default:
        return enUS;
    }
  };

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <QueryProvider>
          <ClerkProvider
            localization={getClerkLocalization(locale)}
            appearance={{
              baseTheme: resolvedTheme === 'dark' ? dark : undefined
            }}
          >
            {children}
          </ClerkProvider>
        </QueryProvider>
      </ActiveThemeProvider>
    </>
  );
}
