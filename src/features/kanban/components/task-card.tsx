import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PrismaTask } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { IconUser, IconDots } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUser } from '@clerk/nextjs';

// export interface Task {
//   id: UniqueIdentifier;
//   columnId: ColumnId;
//   content: string;
// }

interface TaskCardProps {
  task: PrismaTask;
  isOverlay?: boolean;
  onEdit?: (task: PrismaTask) => void;
  onDelete?: (task: PrismaTask) => void;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: PrismaTask;
}

export function TaskCard({ task, isOverlay, onEdit, onDelete }: TaskCardProps) {
  const { user } = useUser();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task'
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    'mb-3 cursor-grab active:cursor-grabbing transition-all duration-100 ease-out hover:shadow-md hover:scale-[1.02]',
    {
      variants: {
        dragging: {
          over: 'ring-2 ring-blue-200 opacity-50 scale-95 transition-all duration-50',
          overlay:
            'ring-2 ring-blue-500 shadow-xl scale-105 rotate-2 transition-all duration-75 ease-out'
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
      {...attributes}
      {...listeners}
    >
      <CardHeader className='flex flex-row items-center justify-between px-4 py-3'>
        <div className='text-muted-foreground flex items-center gap-1'>
          <h3
            className='text-card-foreground mb-2 overflow-hidden font-semibold'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {task.title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-muted h-6 w-6 p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <IconDots className='h-3 w-3' />
              <span className='sr-only'>Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(task)}
                  className='text-destructive focus:text-destructive'
                >
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className='px-4 py-4'>
        {task.description && (
          <p
            className='text-muted-foreground mb-3 overflow-hidden text-sm'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {task.description}
          </p>
        )}

        <div className='text-muted-foreground flex items-center justify-between text-xs'>
          <div className='flex items-center gap-1'>
            <IconUser className='h-3 w-3' />
            <span>{user?.fullName || user?.firstName || 'Usuário'}</span>
          </div>
          <div className='text-muted-foreground/60'>
            {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
