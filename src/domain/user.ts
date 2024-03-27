import { Task } from '@domain/task';

export interface User {
  id: string;
  name: string;
  email: string;
  tasks?: Task[];
}
