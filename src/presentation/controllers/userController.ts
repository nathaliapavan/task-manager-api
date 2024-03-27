import { IUserService } from '@application/userService';
import { Request, Response } from 'express';

export class UserController {
  constructor(private userService: IUserService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const updatedUser = await this.userService.updateUser(userId, req.body);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const deleted = await this.userService.deleteUser(userId);
      if (deleted) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async assignTaskToUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const taskId = req.params.taskId;
      const user = await this.userService.assignTaskToUser(userId, taskId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User or Task not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
