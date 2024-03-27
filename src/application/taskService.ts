import { Task } from '@domain/task';
import { TaskRepository } from '@infrastructure/repositories/taskRepository';
import { TaskCreateRequestBody } from '@presentation/types/taskCreateRequestTypes';
import { TaskUpdateRequestBody } from '@presentation/types/taskUpdateRequestTypes';
import { v4 as uuidv4 } from 'uuid';

export interface ITaskService {
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(task: TaskCreateRequestBody): Promise<Task>;
  updateTask(id: string, task: TaskUpdateRequestBody): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
}

export class TaskService implements ITaskService {
  constructor(private taskRepository: TaskRepository) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.getTaskById(id);
  }

  async createTask(taskData: TaskCreateRequestBody): Promise<Task> {
    const task: Task = { ...taskData,id: uuidv4() };
    return this.taskRepository.createTask(task);
  }

  async updateTask(id: string, taskData: TaskUpdateRequestBody): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);
    if (!existingTask) return null;
    const updatedTask: Task = {
      id: existingTask.id,
      title: taskData.title ?? existingTask.title,
      description: taskData.description ?? existingTask.description,
      completed: taskData.completed ?? existingTask.completed,
    };
    return this.taskRepository.updateTask(id, updatedTask);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.taskRepository.deleteTask(id);
  }
}
