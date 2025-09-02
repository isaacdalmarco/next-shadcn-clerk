import { prisma } from '@/lib/prisma';
import { Task, Column } from '@prisma/client';

export interface CreateTaskData {
  title: string;
  description?: string;
  status: string;
  authorId: string;
  organizationId: string;
  columnId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  columnId?: string;
}

export interface CreateColumnData {
  title: string;
  color?: string;
  order?: number;
  organizationId: string;
}

export interface UpdateColumnData {
  title?: string;
  color?: string;
  order?: number;
}

export class TaskService {
  // Task methods
  static async getAllTasks(organizationId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getTaskById(
    id: string,
    organizationId: string
  ): Promise<Task | null> {
    return prisma.task.findFirst({
      where: {
        id,
        organizationId
      }
    });
  }

  static async createTask(data: CreateTaskData): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        authorId: data.authorId,
        organizationId: data.organizationId,
        ...(data.columnId && { columnId: data.columnId })
      }
    });
  }

  static async updateTask(
    id: string,
    organizationId: string,
    data: UpdateTaskData
  ): Promise<Task> {
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description
        }),
        ...(data.status && { status: data.status }),
        ...(data.columnId !== undefined && { columnId: data.columnId })
      }
    });
  }

  static async deleteTask(id: string, organizationId: string): Promise<void> {
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({
      where: { id }
    });
  }

  static async getTasksByAuthor(
    authorId: string,
    organizationId: string
  ): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        authorId,
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getTasksByStatus(
    status: string,
    organizationId: string
  ): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        status,
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Column methods
  static async getAllColumns(organizationId: string): Promise<Column[]> {
    return prisma.column.findMany({
      where: {
        organizationId
      },
      orderBy: {
        order: 'asc'
      }
    });
  }

  static async getColumnById(
    id: string,
    organizationId: string
  ): Promise<Column | null> {
    return prisma.column.findFirst({
      where: {
        id,
        organizationId
      }
    });
  }

  static async createColumn(data: CreateColumnData): Promise<Column> {
    return prisma.column.create({
      data: {
        title: data.title,
        color: data.color || '#3b82f6',
        order: data.order || 0,
        organizationId: data.organizationId
      }
    });
  }

  static async updateColumn(
    id: string,
    organizationId: string,
    data: UpdateColumnData
  ): Promise<Column> {
    const existingColumn = await prisma.column.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingColumn) {
      throw new Error('Column not found');
    }

    return prisma.column.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.color && { color: data.color }),
        ...(data.order !== undefined && { order: data.order })
      }
    });
  }

  static async deleteColumn(id: string, organizationId: string): Promise<void> {
    const existingColumn = await prisma.column.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingColumn) {
      throw new Error('Column not found');
    }

    await prisma.column.delete({
      where: { id }
    });
  }
}
