import { UserEntity } from '../../infrastructure/entities/userEntity';
import { TaskQuery } from '../../presentation/controllers/taskController';
import { TaskEntity } from '../entities/taskEntity';
import { getRepository } from 'typeorm';

export interface ITaskRepository {
  getTasks(params: TaskQuery): Promise<TaskEntity[]>;
  countTasks(params: TaskQuery): Promise<number>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(task: TaskEntity): Promise<TaskEntity>;
  updateTask(task: TaskEntity): Promise<TaskEntity | null>;
  deleteTask(id: string): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  async getTasks(params: TaskQuery): Promise<TaskEntity[]> {
    return getRepository(TaskEntity).createQueryBuilder('task').skip(params.startIndex).take(params.pageSize).getMany();
  }

  async countTasks(params: TaskQuery): Promise<number> {
    return getRepository(TaskEntity)
      .createQueryBuilder('task')
      .skip(params.startIndex)
      .take(params.pageSize)
      .getCount();
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
