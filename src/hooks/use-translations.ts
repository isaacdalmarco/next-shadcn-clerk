'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export function useAppTranslations() {
  const t = useTranslations();
  const locale = useLocale();

  return {
    t,
    locale,
    // Helper para traduções aninhadas
    tn: (namespace: string, key: string) => {
      try {
        return t(`${namespace}.${key}`);
      } catch {
        return key;
      }
    }
  };
}
