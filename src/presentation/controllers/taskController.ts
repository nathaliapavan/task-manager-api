import { Request, Response } from 'express';
import { ITaskService } from '@application/taskService';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export interface TaskQueryOptions {
  page: number;
  pageSize: number;
}

export class TaskQuery {
  public readonly startIndex: number;

  constructor(
    public readonly page: number,
    public readonly pageSize: number,
  ) {
    this.startIndex = (page - 1) * pageSize;
  }

  static fromRequest(req: Request): TaskQuery {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const pageSize = Math.min(req.query?.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    return new TaskQuery(page, pageSize);
  }
}

export class TaskController {
  constructor(private taskService: ITaskService) {}

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const params = TaskQuery.fromRequest(req);
      const { tasks, totalTasks } = await this.taskService.getTasks(params);
      const totalPages = Math.ceil(totalTasks / params.pageSize) || 0;
      const nextPage = params.page < totalPages ? params.page + 1 : null;
      const prevPage = params.page > 1 ? params.page - 1 : null;
      res.json({
        data: tasks || [],
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          totalUsers: totalTasks || 0,
          totalPages: totalPages,
          nextPage,
          prevPage,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const task = await this.taskService.getTaskById(taskId);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const requestUserId = (req as any).requestUserId;
      const newTask = await this.taskService.createTask(requestUserId, req.body);
      res.status(201).json(newTask);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const updatedTask = await this.taskService.updateTask(taskId, req.body);
      if (updatedTask) {
        res.json(updatedTask);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const deleted = await this.taskService.deleteTask(taskId);
      if (deleted) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
