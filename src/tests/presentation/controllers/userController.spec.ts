import { UserController } from '../../../presentation/controllers/userController';
import { UserService } from '../../../application/userService';
import { InMemoryUserRepository } from '../../infrastructure/repositories/inMemoryUserRepository';
import { Request, Response } from 'express';
import { UserCreate } from '../../../presentation/types/userCreateRequestTypes';
import { UserEntity } from '../../../infrastructure/entities/userEntity';
import { CustomError } from '../../../common/errors/customError';

describe('UserController', () => {
  let userController: UserController;
  let req: Request;
  let res: Response;
  let userRepository = new InMemoryUserRepository();
  let userService: any;

  beforeEach(() => {
    let userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);

    userController = new UserController(userService);
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const newUser = UserEntity.createUser(new UserCreate(userData));
      await userRepository.createUser(newUser);
      userService.getUsers = jest.fn().mockResolvedValue({
        users: await userRepository.getUsers(),
        totalUsers: await userRepository.countUsers(),
      });
      await userController.getUsers(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({
        data: [newUser],
        pagination: { nextPage: null, page: 1, pageSize: 10, prevPage: null, totalPages: 1, totalUsers: 1 },
      });
    });

    it('should return empty users', async () => {
      userService.getUsers = jest.fn().mockResolvedValue([]);
      await userController.getUsers(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        pagination: { nextPage: null, page: 1, pageSize: 10, prevPage: null, totalPages: 0, totalUsers: 0 },
      });
    });

    it('should handle errors by returning status 500', async () => {
      userService.getUsers = jest.fn().mockRejectedValue(new Error('Test error'));
      await userController.getUsers(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Test error' });
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const mockUser = UserEntity.createUser(new UserCreate({ name: 'User 1', email: 'user1@example.com' }));
      await userRepository.createUser(mockUser);
      userService.getUserById = jest.fn().mockResolvedValue(await userRepository.getUserById(mockUser.id as any));
      req = {
        params: { id: mockUser.id },
        body: {},
        query: {},
        headers: {},
      } as any;
      await userController.getUserById(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return status 404 if user not found', async () => {
      userService.getUserById = jest.fn().mockResolvedValue(null);
      req = {
        params: { id: 'id' },
        body: {},
        query: {},
        headers: {},
      } as any;
      await userController.getUserById(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors by returning status 500', async () => {
      userService.getUserById = jest.fn().mockRejectedValue(new Error('Test error'));
      req = {
        params: { id: 'id' },
        body: {},
        query: {},
        headers: {},
      } as any;
      await userController.getUserById(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Test error' });
    });
  });

  describe('createUser', () => {
    it('should throw an error if the body is empty', async () => {
      req = {
        params: {},
        body: {},
        query: {},
        headers: {},
      } as any;
      await userController.createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name and email are required' });
    });

    it('should throw an error if the email does not exist and is empty', async () => {
      req = {
        params: {},
        body: {
          name: 'name',
        },
        query: {},
        headers: {},
      } as any;
      await userController.createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name and email are required' });
    });

    it('should throw an error if the name does not exist and is empty', async () => {
      req = {
        params: {},
        body: {
          email: 'email',
        },
        query: {},
        headers: {},
      } as any;
      await userController.createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name and email are required' });
    });

    it('should throw an error if the email becomes invalid', async () => {
      req = {
        params: {},
        body: {
          name: 'name',
          email: 'email',
        },
        query: {},
        headers: {},
      } as any;
      await userController.createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
    });

    it('should create user', async () => {
      req = {
        params: {},
        body: {
          name: 'name',
          email: 'email@test.com',
        },
        query: {},
        headers: {},
      } as any;
      await userController.createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'name',
          email: 'email@test.com',
        }),
      );
    });

    it('should handle errors by returning status 500', async () => {
      userService.createUser = jest.fn().mockRejectedValue(new Error('Test error'));
      req = {
        params: {},
        body: {},
        query: {},
        headers: {},
      } as any;
      await userController.createUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Test error' });
    });
  });

  describe('updateUser', () => {
    it('should update user when user exists', async () => {
      const bodyUser = { name: 'newName', email: 'new@example.com' };
      req = {
        params: { id: 'id' },
        body: bodyUser,
        query: {},
        headers: {},
      } as any;
      const updatedUser = { id: '1', name: 'newName', email: 'new@example.com' };
      jest.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser);
      await userController.updateUser(req as Request, res as Response);
      expect(userService.updateUser).toHaveBeenCalledWith('id', req.body);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should handle CustomError with status 400 properly', async () => {
      req = {
        params: { id: 'id' },
        body: null,
        query: {},
        headers: {},
      } as any;
      jest.spyOn(userService, 'updateUser').mockRejectedValue(new CustomError('Invalid data', 400));
      await userController.updateUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data' });
    });

    it('should handle CustomError with status 404 properly', async () => {
      req = {
        params: { id: 'id' },
        body: null,
        query: {},
        headers: {},
      } as any;
      jest.spyOn(userService, 'updateUser').mockResolvedValue(null);
      await userController.updateUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors by returning status 500', async () => {
      req = {
        params: { id: 'id' },
        body: null,
        query: {},
        headers: {},
      } as any;
      jest.spyOn(userService, 'updateUser').mockRejectedValue(new Error('Internal Server Error'));
      await userController.updateUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateUser', () => {
    it('should update user when user exists', async () => {
      req = {
        params: { id: 'id' },
        body: null,
        query: {},
        headers: {},
      } as any;
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(true);
      await userController.deleteUser(req as Request, res as Response);
      expect(userService.deleteUser).toHaveBeenCalledWith('id');
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should handle CustomError with status 404 properly', async () => {
      req = {
        params: { id: 'id' },
        body: null,
        query: {},
        headers: {},
      } as any;
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(null);
      await userController.deleteUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors by returning status 500', async () => {
      req = {
        params: { id: 'id' },
        body: null,
        query: {},
        headers: {},
      } as any;
      jest.spyOn(userService, 'deleteUser').mockRejectedValue(new Error('Internal Server Error'));
      await userController.deleteUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
