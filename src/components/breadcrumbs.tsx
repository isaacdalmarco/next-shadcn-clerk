'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { IconSlash } from '@tabler/icons-react';
import { Fragment } from 'react';
import { useTranslations } from 'next-intl';

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  const t = useTranslations('breadcrumbs');

  if (items.length === 0) return null;

  // Função para traduzir títulos comuns
  const translateTitle = (title: string) => {
    const commonTitles: Record<string, string> = {
      Home: t('home'),
      Dashboard: t('dashboard')
    };
    return commonTitles[title] || title;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href={item.link}>
                  {translateTitle(item.title)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <IconSlash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{translateTitle(item.title)}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
