import { TaskEntity } from '../entities/taskEntity';
import { getRepository } from 'typeorm';

export interface ITaskRepository {
  getAllTasks(): Promise<TaskEntity[]>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(task: TaskEntity): Promise<TaskEntity>;
  updateTask(task: TaskEntity): Promise<TaskEntity | null>;
  deleteTask(id: string): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  async getAllTasks(): Promise<TaskEntity[]> {
    return getRepository(TaskEntity).find();
  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return getRepository(TaskEntity).findOne({ where: { id } });
  }

  async createTask(task: TaskEntity): Promise<TaskEntity> {
    return getRepository(TaskEntity).save(task);
  }

  async updateTask(task: TaskEntity): Promise<TaskEntity | null> {
    return getRepository(TaskEntity).save(task);
  }

  async deleteTask(id: string): Promise<boolean> {
    const deleted = await getRepository(TaskEntity).delete(id);
    return !!deleted.affected;
  }
}
