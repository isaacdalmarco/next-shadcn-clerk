import { useTranslations } from 'next-intl';
import { NavItem } from '@/types';

export function useNavItems(): NavItem[] {
  const t = useTranslations('navigation');

  return [
    {
      title: t('dashboard'),
      url: '/dashboard/overview',
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: []
    },
    {
      title: t('products'),
      url: '/dashboard/product',
      icon: 'product',
      shortcut: ['p', 'p'],
      isActive: false,
      items: []
    },
    {
      title: t('kanban'),
      url: '/dashboard/kanban',
      icon: 'kanban',
      shortcut: ['k', 'k'],
      isActive: false,
      items: []
    },
    {
      title: t('posts'),
      url: '/dashboard/posts',
      icon: 'posts',
      shortcut: ['o', 'o'],
      isActive: false,
      items: []
    }
  ];
}
