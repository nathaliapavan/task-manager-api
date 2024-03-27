import { Task } from '@domain/task';

export interface ITaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(task: Task): Promise<Task>;
  updateTask(id: string, task: Task): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.tasks.find((task) => task.id === id) || null;
  }

  async createTask(task: Task): Promise<Task> {
    this.tasks.push(task);
    return task;
  }

  async updateTask(id: string, updatedTask: Task): Promise<Task | null> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask, id };
      return this.tasks[index];
    }
    return null;
  }

  async deleteTask(id: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks.length < initialLength;
  }
}
