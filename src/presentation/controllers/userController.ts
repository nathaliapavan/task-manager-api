import { IUserService } from '@application/userService';
import { CustomError } from '../../common/errors/customError';
import { Request, Response } from 'express';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export interface UserQueryOptions {
  page: number;
  pageSize: number;
  name?: string;
  email?: string;
}

export class UserQuery {
  public readonly startIndex: number;

  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly name?: string,
    public readonly email?: string,
  ) {
    this.startIndex = (page - 1) * pageSize;
  }

  static fromRequest(req: Request): UserQuery {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const pageSize = Math.min(req.query?.pageSize ? Number(req.query.pageSize) : DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const name = req.query?.name ? String(req.query.name) : undefined;
    const email = req.query?.email ? String(req.query.email) : undefined;
    return new UserQuery(page, pageSize, name, email);
  }
}

export class UserController {
  constructor(private userService: IUserService) {}

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get users
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const params = UserQuery.fromRequest(req);
      const { users, totalUsers } = await this.userService.getUsers(params);
      const totalPages = Math.ceil(totalUsers / params.pageSize) || 0;
      const nextPage = params.page < totalPages ? params.page + 1 : null;
      const prevPage = params.page > 1 ? params.page - 1 : null;
      res.json({
        data: users || [],
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          totalUsers: totalUsers || 0,
          totalPages: totalPages,
          nextPage,
          prevPage,
        },
      });
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
