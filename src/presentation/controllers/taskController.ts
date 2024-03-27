import { Request, Response } from 'express';
import { ITaskService } from '@application/taskService';

export class TaskController {
  constructor(private taskService: ITaskService) {}

  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
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
      const newTask = await this.taskService.createTask(req.body);
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
