import { headers, cookies } from 'next/headers';
import { locales, defaultLocale, type Locale } from './index';

// Função para detectar o idioma do header accept-language no servidor
export async function getLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();

    // Primeiro, verifica se há uma preferência salva em cookie
    const preferredLocale = cookieStore.get('preferred-locale')?.value;
    if (preferredLocale && locales.includes(preferredLocale as Locale)) {
      return preferredLocale as Locale;
    }

    // Se não há preferência salva, usa o header accept-language
    const acceptLanguage = headersList.get('accept-language');

    if (!acceptLanguage) {
      return defaultLocale;
    }

    // Parse do header accept-language (ex: "en-US,en;q=0.9,pt-BR;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map((lang: string) => {
        const [code, quality] = lang.trim().split(';q=');
        return {
          code: code.trim(), // Mantém o código completo (en-US, pt-BR, etc.)
          quality: quality ? parseFloat(quality) : 1.0
        };
      })
      .sort(
        (a: { quality: number }, b: { quality: number }) =>
          b.quality - a.quality
      ); // Ordena por qualidade

    // Mapeia códigos de idioma para nossos códigos
    const localeMap: Record<string, Locale> = {
      'en-US': 'en',
      en: 'en',
      'es-ES': 'es',
      es: 'es',
      'pt-BR': 'pt-BR',
      pt: 'pt-BR'
    };

    // Encontra o primeiro idioma suportado
    for (const lang of languages) {
      if (localeMap[lang.code]) {
        return localeMap[lang.code];
      }
    }

    return defaultLocale;
  } catch {
    return defaultLocale;
  }
}
