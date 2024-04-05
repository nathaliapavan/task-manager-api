import { IUserRepository } from '../infrastructure/repositories/userRepository';
import { TaskEntity } from '../infrastructure/entities/taskEntity';
import { ITaskRepository } from '../infrastructure/repositories/taskRepository';
import { TaskCreate, TaskCreateRequestBody } from '../presentation/types/taskCreateRequestTypes';
import { CustomError } from '../common/errors/customError';
import { TaskUpdate, TaskUpdateRequestBody } from '../presentation/types/taskUpdateRequestTypes';
import { TaskQuery } from '../presentation/controllers/taskController';
import { NotifyObserver } from '../infrastructure/notification/emailNotificationService';

export interface TasksData {
  tasks: TaskEntity[];
  totalTasks: number;
}

export interface ITaskService {
  getTasks(params: TaskQuery): Promise<TasksData>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(userId: string, task: TaskCreateRequestBody): Promise<TaskEntity>;
  updateTask(id: string, task: TaskUpdateRequestBody): Promise<TaskEntity | null>;
  deleteTask(taskId: string): Promise<boolean>;
}

export class TaskService implements ITaskService {
  private notifyObserver: NotifyObserver[] = [];

  constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository,
  ) {}

  addObserver(observer: NotifyObserver) {
    this.notifyObserver.push(observer);
  }

  private async notifyObservers(data: any) {
    await Promise.all(this.notifyObserver.map((observer) => observer.changeTaskNotification(data)));
  }

  async getTasks(params: TaskQuery): Promise<TasksData> {
    const [tasks, totalTasks] = await Promise.all([
      this.taskRepository.getTasks(params),
      this.taskRepository.countTasks(params),
    ]);
    return { tasks, totalTasks };
  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.getTaskById(id);
  }

  async createTask(userId: string, taskData: TaskCreateRequestBody): Promise<TaskEntity> {
    const taskCreate = new TaskCreate(taskData);
    if (taskCreate.data.assignedToId) {
      const assignedUser = await this.userRepository.getUserById(taskCreate.data.assignedToId);
      if (!assignedUser) {
        console.error(`User ${assignedUser} not found`);
        throw new CustomError('Unable to create task for this user', 500);
      }
    }
    const task = TaskEntity.createTask(userId, taskCreate);
    const createdTask = await this.taskRepository.createTask(task);
    if (createdTask?.assignedToId)
      this.notifyObservers({
        action: 'create',
        task: createdTask,
        emailsAssociatedUsers: await this.getEmailsOfAssociatedUsers(createdTask),
      });
    return createdTask;
  }

  async updateTask(id: string, taskData: TaskUpdateRequestBody): Promise<TaskEntity | null> {
    const taskCreate = new TaskUpdate(taskData);
    const existingTask = await this.taskRepository.getTaskById(id);
    if (!existingTask) {
      throw new CustomError('Task not found', 404);
    }
    const task = TaskEntity.updateTask(existingTask, taskCreate);
    if (!task.assignedToId && task.status !== 'pending') {
      throw new CustomError('You cannot change the status without associating this task', 400);
    }
    const updatedTask = await this.taskRepository.updateTask(task);
    this.notifyObservers({
      action: 'update',
      task: task,
      emailsAssociatedUsers: await this.getEmailsOfAssociatedUsers(task),
    });
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const existingTask = await this.taskRepository.getTaskById(taskId);
    if (!existingTask) {
      throw new CustomError('Task not found', 404);
    }
    const deletedTask = await this.taskRepository.deleteTask(taskId);
    this.notifyObservers({
      action: 'delete',
      task: existingTask,
      emailsAssociatedUsers: await this.getEmailsOfAssociatedUsers(existingTask),
    });
    return deletedTask;
  }

  async getEmailsOfAssociatedUsers(task: TaskEntity): Promise<{ assignedToEmail: string; createdByEmail: string }> {
    const assignedToUser = await this.userRepository.getUserById(task?.assignedToId || '');
    const createdByUser = await this.userRepository.getUserById(task?.createdById || '');
    return {
      assignedToEmail: assignedToUser?.email || '',
      createdByEmail: createdByUser?.email || '',
    };
  }
}
