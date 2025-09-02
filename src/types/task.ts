import { Task, Column } from '@prisma/client';

export type { Task, Column };

export type TaskWithAuthor = Task & {
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
};

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: string;
  authorId: string;
  organizationId: string;
  columnId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  columnId?: string;
}

export interface CreateColumnInput {
  title: string;
  order?: number;
  organizationId: string;
}

export interface UpdateColumnInput {
  title?: string;
  order?: number;
}
