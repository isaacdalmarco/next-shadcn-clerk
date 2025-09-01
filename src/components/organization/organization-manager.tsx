'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrganizationBilling } from './organization-billing';
import {
  CreateOrganization,
  OrganizationProfile,
  OrganizationList,
  OrganizationSwitcher
} from '@clerk/nextjs';
import {
  IconBuilding,
  IconCreditCard,
  IconUsers,
  IconSettings
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function OrganizationManager() {
  const t = useTranslations('organization');

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title={t('manageOrganization')}
          description={t('manageOrganizationDescription')}
        />
        <OrganizationSwitcher />
      </div>

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview' className='flex items-center space-x-2'>
            <IconBuilding className='h-4 w-4' />
            <span>{t('overview')}</span>
          </TabsTrigger>
          <TabsTrigger value='billing' className='flex items-center space-x-2'>
            <IconCreditCard className='h-4 w-4' />
            <span>{t('billing')}</span>
          </TabsTrigger>
          <TabsTrigger value='members' className='flex items-center space-x-2'>
            <IconUsers className='h-4 w-4' />
            <span>{t('members')}</span>
          </TabsTrigger>
          <TabsTrigger value='settings' className='flex items-center space-x-2'>
            <IconSettings className='h-4 w-4' />
            <span>{t('settings')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>{t('organizations')}</CardTitle>
              <CardDescription>{t('organizationsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='billing' className='space-y-4'>
          <OrganizationBilling />
        </TabsContent>

        <TabsContent value='members' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>{t('organizationMembers')}</CardTitle>
              <CardDescription>
                {t('organizationMembersDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                {t('organizationMembersHelp')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='settings' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>{t('organizationSettings')}</CardTitle>
              <CardDescription>
                {t('organizationSettingsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationProfile />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
