import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Lista de idiomas suportados
export const locales = ['en', 'es', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

// Idioma padrão
export const defaultLocale: Locale = 'en';

// Função para detectar o idioma do browser no lado do cliente
export const getLocale = async () => {
  const headersList = await headers();
  const l = headersList?.get('accept-language');
  const locale = l && l.split(',')[0];

  return locale && locales.includes(locale as Locale) ? locale : defaultLocale;
};

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
