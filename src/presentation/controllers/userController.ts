import { IUserService } from '@application/userService';
import { CustomError } from '../../common/errors/customError';
import { Request, Response } from 'express';

export class UserController {
  constructor(private userService: IUserService) {}

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   */
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

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update user by ID
   *     description: Updates a user's information by their ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID to be updated
   *         schema:
   *           type: string
   *       - in: body
   *         name: body
   *         description: User data to be updated
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               required:
   *                 - name
   *               properties:
   *                 name:
   *                   type: string
   *               example:
   *                 name: New user name
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             example:
   *               created_at: "2024-03-29T22:41:23.000Z"
   *               updated_at: "2024-03-30T00:29:03.468Z"
   *               id: "2d1ccdb5-0e45-4b39-afde-e76c881a4c1b"
   *               name: "update"
   *               email: "nat2@email.com"
   *       400:
   *         description: Name is required
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
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
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete user by ID
   *     description: Delete a user from the system by their ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID to be deleted
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
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
}
