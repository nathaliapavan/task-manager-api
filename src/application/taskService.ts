import { IUserRepository } from '../infrastructure/repositories/userRepository';
import { TaskEntity } from '../infrastructure/entities/taskEntity';
import { ITaskRepository } from '../infrastructure/repositories/taskRepository';
import { TaskCreate, TaskCreateRequestBody } from '../presentation/types/taskCreateRequestTypes';
import { CustomError } from '../common/errors/customError';
import { TaskUpdate, TaskUpdateRequestBody } from '../presentation/types/taskUpdateRequestTypes';

export interface ITaskService {
  getAllTasks(): Promise<TaskEntity[]>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(userId: string, task: TaskCreateRequestBody): Promise<TaskEntity>;
  updateTask(id: string, task: TaskUpdateRequestBody): Promise<TaskEntity | null>;
  deleteTask(userId: string, taskId: string): Promise<boolean>;
}

export class TaskService implements ITaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository,
  ) {}

  async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.getTaskById(id);
  }

  async createTask(userId: string, taskData: TaskCreateRequestBody): Promise<TaskEntity> {
    const taskCreate = new TaskCreate(taskData);
    if (taskCreate.data.assignedToId) {
      const assignedUser = await this.userRepository.getUserById(taskCreate.data.assignedToId);
      if (!assignedUser) {
        console.error(`Usuário ${assignedUser} nao existe`);
        throw new CustomError('Nao foi possivel criar tarefa pra esse usuário', 500);
      }
    }

    const task = TaskEntity.createTask(userId, taskCreate);
    return this.taskRepository.createTask(task);
  }

  async updateTask(id: string, taskData: TaskUpdateRequestBody): Promise<TaskEntity | null> {
    const taskCreate = new TaskUpdate(taskData);
    const existingTask = await this.taskRepository.getTaskById(id);
    if (!existingTask) {
      throw new CustomError('Tarefa nao existe', 404);
    }
    const task = TaskEntity.updateTask(existingTask, taskCreate);
    if (!task.assignedToId && task.status !== 'pending') {
      throw new CustomError('Voce nao pode trocar o status sem associar essa tarefa', 404);
    }
    return this.taskRepository.updateTask(task);
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const task = await this.getTaskById(taskId);
    if (userId !== task?.createdById) {
      throw new CustomError('Voce nao pode deletar essa tarefa', 403);
    }
    return this.taskRepository.deleteTask(taskId);
  }
}
