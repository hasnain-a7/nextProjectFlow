export interface User {
  _id?: string;
  email: string;
  fullname: string;
  location?: string | null;
  occupation?: string | null;
  organization?: string | null;
  isActive?: boolean;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Task {
  _id?: string;
  title: string;
  todo: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  attachments?: string[];
  dueDate?: string;
  userId?: string | null;
  projectId?: string;
  todoEmoji?: string;
}
export interface Project {
  _id?: string;
  title: string;
  Category?: string;
  description: string;
  url?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: string[];
  dueDate?: string;
  status?: string;
  assignedUsers?: string[];
  projectEmoji?: string;
  Tasks?: Task[];
}
