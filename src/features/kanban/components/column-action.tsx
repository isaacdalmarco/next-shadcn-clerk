'use client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUpdateColumn, useDeleteColumn } from '@/hooks/use-tasks';
import { ColorPicker } from '@/components/ui/color-picker';
import { useState } from 'react';

export function ColumnActions({
  title,
  id,
  color
}: {
  title: string;
  id: UniqueIdentifier;
  color?: string;
}) {
  const [name, setName] = React.useState(title);
  const [currentColor, setCurrentColor] = useState(color || '#3b82f6');
  const updateColumnMutation = useUpdateColumn();
  const deleteColumnMutation = useDeleteColumn();
  const [editDisable, setIsEditDisable] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleColorChange = async (newColor: string) => {
    setCurrentColor(newColor);
    try {
      await updateColumnMutation.mutateAsync({
        id: id as string,
        data: { color: newColor }
      });
      toast.success('Cor atualizada com sucesso');
    } catch (error) {
      toast.error('Falha ao atualizar cor');
    }
  };

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsEditDisable(!editDisable);
          try {
            await updateColumnMutation.mutateAsync({
              id: id as string,
              data: { title: name }
            });
            toast(`${title} updated to ${name}`);
          } catch (error) {
            toast.error('Failed to update column');
          }
        }}
      >
        <div className='relative flex-1'>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-0! mr-auto pl-8 text-base disabled:cursor-pointer disabled:border-none disabled:opacity-100'
            disabled={editDisable}
            ref={inputRef}
          />
          {currentColor && (
            <div
              className='border-border absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 rounded-full border'
              style={{ backgroundColor: currentColor }}
            />
          )}
        </div>
      </form>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' className='ml-1'>
            <span className='sr-only'>Actions</span>
            <DotsHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onSelect={() => {
              setIsEditDisable(!editDisable);
              setTimeout(() => {
                inputRef.current && inputRef.current?.focus();
              }, 500);
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowColorPicker(true)}>
            Change Color
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className='text-red-600'
          >
            Delete Section
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete column?
            </AlertDialogTitle>
            <AlertDialogDescription>
              NOTE: All tasks related to this category will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={async () => {
                // yes, you have to set a timeout
                setTimeout(() => (document.body.style.pointerEvents = ''), 100);

                setShowDeleteDialog(false);
                try {
                  await deleteColumnMutation.mutateAsync(id as string);
                  toast('This column has been deleted.');
                } catch (error) {
                  toast.error('Failed to delete column');
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Color Picker Dialog */}
      <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Alterar Cor da Seção</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <ColorPicker value={currentColor} onChange={handleColorChange} />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowColorPicker(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
