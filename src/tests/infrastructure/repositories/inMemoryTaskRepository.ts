import { ITaskRepository } from '../../../infrastructure/repositories/taskRepository';
import { TaskEntity } from '../../../infrastructure/entities/taskEntity';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: TaskEntity[] = [];

  async getTasks(): Promise<TaskEntity[]> {
    return this.tasks;
  }

  async countTasks(): Promise<number> {
    return this.tasks.length;
  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return this.tasks.find((task) => task.id === id) || null;
  }

  async updateTask(task: TaskEntity): Promise<TaskEntity | null> {
    const index = this.tasks.findIndex((u) => u.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      return task;
    }
    return null;
  }

  async deleteTask(id: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks.length !== initialLength;
  }

  async createTask(task: TaskEntity): Promise<any> {
    this.tasks.push(task);
    return this.getTaskById(task.id as any);
  }
}
