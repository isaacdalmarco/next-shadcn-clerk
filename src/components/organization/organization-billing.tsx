'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  IconBuilding,
  IconCreditCard,
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  current?: boolean;
  popular?: boolean;
}

const BILLING_PLANS: BillingPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    interval: 'monthly',
    features: ['Até 5 usuários', 'Funcionalidades básicas', 'Suporte por email']
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 29,
    interval: 'monthly',
    features: [
      'Até 25 usuários',
      'Funcionalidades avançadas',
      'Suporte prioritário',
      'Backup automático'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 99,
    interval: 'monthly',
    features: [
      'Usuários ilimitados',
      'Todas as funcionalidades',
      'Suporte 24/7',
      'SLA garantido',
      'Integrações personalizadas'
    ]
  }
];

export function OrganizationBilling() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isYearly, setIsYearly] = useState(false);

  const getYearlyPrice = (monthlyPrice: number) => monthlyPrice * 10; // 2 meses grátis

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBillingToggle = () => {
    setIsYearly(!isYearly);
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>Planos e Preços</h2>
        <p className='text-muted-foreground'>
          Escolha o plano ideal para sua organização
        </p>
      </div>

      {/* Toggle Billing */}
      <div className='flex items-center justify-center space-x-4'>
        <span
          className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Mensal
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={handleBillingToggle}
          className='relative'
        >
          <div
            className={`bg-primary h-6 w-6 rounded-full transition-transform duration-200 ${isYearly ? 'translate-x-3' : 'translate-x-0'}`}
          />
        </Button>
        <span
          className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Anual
          <Badge variant='secondary' className='ml-2'>
            -20%
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className='grid gap-6 md:grid-cols-3'>
        {BILLING_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all hover:shadow-lg ${
              plan.popular ? 'ring-primary ring-2' : ''
            } ${selectedPlan === plan.id ? 'border-primary' : ''}`}
          >
            {plan.popular && (
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 transform'>
                Mais Popular
              </Badge>
            )}

            <CardHeader className='pb-4 text-center'>
              <CardTitle className='text-xl'>{plan.name}</CardTitle>
              <div className='space-y-1'>
                <div className='text-3xl font-bold'>
                  R$ {isYearly ? getYearlyPrice(plan.price) : plan.price}
                </div>
                <div className='text-muted-foreground text-sm'>
                  {isYearly ? 'por ano' : 'por mês'}
                  {isYearly && plan.price > 0 && (
                    <span className='block text-xs'>
                      R$ {plan.price}/mês cobrado anualmente
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              <ul className='space-y-2'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-center space-x-2'>
                    <IconCheck className='h-4 w-4 text-green-500' />
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>

              <Separator />

              <Button
                className='w-full'
                variant={selectedPlan === plan.id ? 'default' : 'outline'}
                onClick={() => handlePlanChange(plan.id)}
              >
                {selectedPlan === plan.id ? 'Plano Atual' : 'Escolher Plano'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Plan Info */}
      <Card className='bg-muted/50'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <IconCreditCard className='h-5 w-5' />
            <span>Plano Atual</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>Profissional - Mensal</p>
              <p className='text-muted-foreground text-sm'>
                R$ 29,00/mês • Próxima cobrança em 15 de Janeiro, 2025
              </p>
            </div>
            <Button variant='outline' size='sm'>
              Gerenciar Assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cobranças</CardTitle>
          <CardDescription>
            Visualize suas faturas e pagamentos anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div>
                <p className='font-medium'>Janeiro 2025</p>
                <p className='text-muted-foreground text-sm'>
                  Plano Profissional
                </p>
              </div>
              <div className='text-right'>
                <p className='font-medium'>R$ 29,00</p>
                <Badge variant='secondary'>Pago</Badge>
              </div>
            </div>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div>
                <p className='font-medium'>Dezembro 2024</p>
                <p className='text-muted-foreground text-sm'>
                  Plano Profissional
                </p>
              </div>
              <div className='text-right'>
                <p className='font-medium'>R$ 29,00</p>
                <Badge variant='secondary'>Pago</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
