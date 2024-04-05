import { IUserRepository } from '../infrastructure/repositories/userRepository';
import { TaskEntity } from '../infrastructure/entities/taskEntity';
import { ITaskRepository } from '../infrastructure/repositories/taskRepository';
import { TaskCreate, TaskCreateRequestBody } from '../presentation/types/taskCreateRequestTypes';
import { CustomError } from '../common/errors/customError';
import { TaskUpdate, TaskUpdateRequestBody } from '../presentation/types/taskUpdateRequestTypes';
import { TaskQuery } from '../presentation/controllers/taskController';

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
  constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository,
  ) {}

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
    return this.taskRepository.createTask(task);
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
    return this.taskRepository.updateTask(task);
  }

  async deleteTask(taskId: string): Promise<boolean> {
    return this.taskRepository.deleteTask(taskId);
  }
}
