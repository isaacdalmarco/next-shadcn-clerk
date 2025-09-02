import { Task, Column } from '@prisma/client';

export type PrismaTask = Task & {
  authorId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PrismaColumn = Column;

export type ColumnId = string;

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type KanbanColumn = {
  id: string;
  title: string;
  color: string;
};

export type KanbanTask = PrismaTask;
