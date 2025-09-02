import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByAuthor,
  getTasksByStatus,
  getColumns,
  getColumnById,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns
} from '@/actions/task-actions';
import { UpdateTaskData, UpdateColumnData } from '@/services/task-service';
import { useOrganization } from '@clerk/nextjs';

// Task hooks
export function useTasks() {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['tasks', organization?.id],
    queryFn: getTasks,
    enabled: !!organization?.id
  });
}

export function useTask(id: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['tasks', id, organization?.id],
    queryFn: () => getTaskById(id),
    enabled: !!id && !!organization?.id
  });
}

export function useTasksByAuthor(authorId: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['tasks', 'author', authorId, organization?.id],
    queryFn: () => getTasksByAuthor(authorId),
    enabled: !!authorId && !!organization?.id
  });
}

export function useTasksByStatus(status: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['tasks', 'status', status, organization?.id],
    queryFn: () => getTasksByStatus(status),
    enabled: !!status && !!organization?.id
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      status: string;
      columnId?: string;
    }) => createTask(data),
    onSuccess: (newTask) => {
      // Atualização otimista - adicionar a nova task à lista
      queryClient.setQueryData(['tasks', organization?.id], (old: any) => {
        if (!old) return [newTask];
        return [...old, newTask];
      });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({
        queryKey: ['tasks', organization?.id]
      });

      // Snapshot do estado anterior
      const previousTasks = queryClient.getQueryData([
        'tasks',
        organization?.id
      ]);

      // Atualização otimista
      queryClient.setQueryData(['tasks', organization?.id], (old: any) => {
        if (!old) return old;
        return old.map((task: any) =>
          task.id === id ? { ...task, ...data } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Reverter em caso de erro
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', organization?.id],
          context.previousTasks
        );
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', organization?.id] });
      queryClient.invalidateQueries({
        queryKey: ['tasks', id, organization?.id]
      });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', organization?.id] });
    }
  });
}

// Column hooks
export function useColumns() {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['columns', organization?.id],
    queryFn: getColumns,
    enabled: !!organization?.id
  });
}

export function useColumn(id: string) {
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['columns', id, organization?.id],
    queryFn: () => getColumnById(id),
    enabled: !!id && !!organization?.id
  });
}

export function useCreateColumn() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (data: { title: string; color?: string; order?: number }) =>
      createColumn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['columns', organization?.id]
      });
    }
  });
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnData }) =>
      updateColumn(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['columns', organization?.id]
      });
      queryClient.invalidateQueries({
        queryKey: ['columns', id, organization?.id]
      });
    }
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (id: string) => deleteColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['columns', organization?.id]
      });
    }
  });
}

export function useReorderColumns() {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();

  return useMutation({
    mutationFn: (columnIds: string[]) => reorderColumns(columnIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['columns', organization?.id]
      });
    }
  });
}
