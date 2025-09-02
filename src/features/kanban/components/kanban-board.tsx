'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PrismaTask } from '../types';
import { hasDraggableData } from '../utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { TaskCard } from './task-card';
import {
  useTasks,
  useColumns,
  useUpdateTask,
  useReorderColumns
} from '@/hooks/use-tasks';
// import { coordinateGetter } from "./multipleContainersKeyboardPreset";

export type ColumnId = string;

export function KanbanBoard() {
  const { data: prismaTasks } = useTasks();
  const { data: prismaColumns } = useColumns();
  const updateTaskMutation = useUpdateTask();
  const reorderColumnsMutation = useReorderColumns();

  // Funções para edição e exclusão de tasks
  const handleEditTask = (task: PrismaTask) => {
    // TODO: Implementar edição de task
    console.log('Edit task:', task);
  };

  const handleDeleteTask = (task: PrismaTask) => {
    // TODO: Implementar exclusão de task
    console.log('Delete task:', task);
  };

  const pickedUpTaskColumn = useRef<string>('');

  // Converter colunas do Prisma para o formato do Kanban
  const columns = useMemo(() => {
    if (!prismaColumns) return [];
    return prismaColumns
      .sort((a, b) => a.order - b.order) // Ordenar por ordem
      .map((col) => ({
        id: col.id,
        title: col.title,
        color: col.color
      }));
  }, [prismaColumns]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);
  const [activeTask, setActiveTask] = useState<PrismaTask | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3 // Reduzido para 3px para máxima responsividade
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Reduzido para 100ms para resposta mais rápida
        tolerance: 3 // Reduzido para 3px
      }
    })
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
    const tasksInColumn =
      prismaTasks?.filter((task) => task.columnId === columnId) || [];
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Task') {
        const taskColumnId = active.data.current.task.columnId || '';
        pickedUpTaskColumn.current = taskColumnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          taskColumnId
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const overTaskColumnId = over.data.current.task.columnId || '';
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          overTaskColumnId
        );
        if (overTaskColumnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = '';
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const overTaskColumnId = over.data.current.task.columnId || '';
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          overTaskColumnId
        );
        if (overTaskColumnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = '';
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = '';
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col, index) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                tasks={
                  prismaTasks?.filter((task) => task.columnId === col.id) || []
                }
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
              {index === columns?.length - 1 && (
                <div className='w-[300px]'>
                  <NewSectionDialog />
                </div>
              )}
            </Fragment>
          ))}
          {!columns.length && <NewSectionDialog />}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={
                  prismaTasks?.filter(
                    (task) => task.columnId === activeColumn.id
                  ) || []
                }
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    // Reordenar colunas no banco de dados
    const reorderedColumns = arrayMove(
      columns,
      activeColumnIndex,
      overColumnIndex
    );
    const columnIds = reorderedColumns.map((col) => col.id as string);
    reorderColumnsMutation.mutate(columnIds);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask && prismaTasks) {
      const activeIndex = prismaTasks.findIndex((t) => t.id === activeId);
      const overIndex = prismaTasks.findIndex((t) => t.id === overId);
      const activeTask = prismaTasks[activeIndex];
      const overTask = prismaTasks[overIndex];
      if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
        // Atualizar columnId no banco de dados
        updateTaskMutation.mutate({
          id: activeTask.id,
          data: { columnId: overTask.columnId || undefined }
        });
        // A atualização local será feita automaticamente pelo Tanstack Query
        // quando a mutation for bem-sucedida
      }
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn && prismaTasks) {
      const activeIndex = prismaTasks.findIndex((t) => t.id === activeId);
      const activeTask = prismaTasks[activeIndex];
      if (activeTask) {
        const newColumnId = overId as string;
        // Atualizar columnId no banco de dados
        updateTaskMutation.mutate({
          id: activeTask.id,
          data: { columnId: newColumnId }
        });
        // A atualização local será feita automaticamente pelo Tanstack Query
        // quando a mutation for bem-sucedida
      }
    }
  }
}
