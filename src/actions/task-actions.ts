'use server';

import {
  TaskService,
  CreateTaskData,
  UpdateTaskData,
  CreateColumnData,
  UpdateColumnData
} from '@/services/task-service';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

// Task actions
export async function getTasks() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await TaskService.getAllTasks(orgId);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTaskById(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await TaskService.getTaskById(id, orgId);
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
}

export async function createTask(
  data: Omit<CreateTaskData, 'authorId' | 'organizationId'>
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const task = await TaskService.createTask({
      ...data,
      authorId: userId,
      organizationId: orgId
    });

    revalidatePath('/dashboard/kanban');
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create task'
    );
  }
}

export async function updateTask(id: string, data: UpdateTaskData) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const task = await TaskService.updateTask(id, orgId, data);
    revalidatePath('/dashboard/kanban');
    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update task'
    );
  }
}

export async function deleteTask(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    await TaskService.deleteTask(id, orgId);
    revalidatePath('/dashboard/kanban');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete task'
    );
  }
}

export async function getTasksByAuthor(authorId: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await TaskService.getTasksByAuthor(authorId, orgId);
  } catch (error) {
    console.error('Error fetching tasks by author:', error);
    throw new Error('Failed to fetch tasks by author');
  }
}

export async function getTasksByStatus(status: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await TaskService.getTasksByStatus(status, orgId);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    throw new Error('Failed to fetch tasks by status');
  }
}

// Column actions
export async function getColumns() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const columns = await TaskService.getAllColumns(orgId);
    console.log('Columns:', columns);
    return columns;
  } catch (error) {
    console.error('Error fetching columns:', error);
    throw new Error('Failed to fetch columns');
  }
}

export async function getColumnById(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return await TaskService.getColumnById(id, orgId);
  } catch (error) {
    console.error('Error fetching column:', error);
    throw new Error('Failed to fetch column');
  }
}

export async function createColumn(
  data: Omit<CreateColumnData, 'organizationId'>
) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const column = await TaskService.createColumn({
      ...data,
      organizationId: orgId
    });

    revalidatePath('/dashboard/kanban');
    return column;
  } catch (error) {
    console.error('Error creating column:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create column'
    );
  }
}

export async function updateColumn(id: string, data: UpdateColumnData) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    const column = await TaskService.updateColumn(id, orgId, data);
    revalidatePath('/dashboard/kanban');
    return column;
  } catch (error) {
    console.error('Error updating column:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update column'
    );
  }
}

export async function deleteColumn(id: string) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    await TaskService.deleteColumn(id, orgId);
    revalidatePath('/dashboard/kanban');
  } catch (error) {
    console.error('Error deleting column:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete column'
    );
  }
}

export async function reorderColumns(columnIds: string[]) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error('Organization not found');
    }

    // Atualizar a ordem de cada coluna
    const updatePromises = columnIds.map((columnId, index) =>
      updateColumn(columnId, { order: index })
    );

    await Promise.all(updatePromises);
    revalidatePath('/dashboard/kanban');
  } catch (error) {
    console.error('Error reordering columns:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to reorder columns'
    );
  }
}
