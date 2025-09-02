'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Palette } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#ec4899', // Pink
  '#6b7280', // Gray
  '#14b8a6', // Teal
  '#a855f7' // Violet
];

export function ColorPicker({
  value = '#3b82f6',
  onChange,
  className
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const handleColorChange = (color: string) => {
    onChange?.(color);
    setOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor='color-picker'>Cor da seção</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-start gap-2'
            id='color-picker'
          >
            <div
              className='h-4 w-4 rounded border'
              style={{ backgroundColor: value }}
            />
            <span className='text-sm'>{value.toUpperCase()}</span>
            <Palette className='ml-auto h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-3' align='start'>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Cores predefinidas</Label>
              <div className='grid grid-cols-6 gap-2'>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      'h-8 w-8 rounded border-2 transition-all hover:scale-110',
                      value === color ? 'border-foreground' : 'border-border'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  >
                    {value === color && (
                      <Check className='h-4 w-4 text-white drop-shadow-sm' />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Cor personalizada</Label>
              <div className='flex gap-2'>
                <Input
                  type='color'
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className='h-8 w-16 p-1'
                />
                <Input
                  type='text'
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  placeholder='#000000'
                  className='flex-1 text-sm'
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
