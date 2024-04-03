import express, { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { taskController } from '../../infrastructure/ioc/taskIoc';
import { userController } from '../../infrastructure/ioc/userIoc';
import PingController from '../controllers/pingController';
import AuthController from '../../presentation/controllers/authController';
import { AuthService } from '../../application/authService';
import { UserRepository } from '../../infrastructure/repositories/userRepository';

const router = express.Router();

router.post('/login', async (req, res) => {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const controller = new AuthController(authService);
  const response = await controller.login(req, res);
  return res.send(response);
});

router.get('/tasks', authenticateToken, taskController.getAllTasks.bind(taskController));
router.get('/tasks/:id', authenticateToken, taskController.getTaskById.bind(taskController));
router.post('/tasks', authenticateToken, taskController.createTask.bind(taskController));
router.put('/tasks/:id', authenticateToken, taskController.updateTask.bind(taskController));
router.delete('/tasks/:id', authenticateToken, taskController.deleteTask.bind(taskController));

router.get('/users', authenticateToken, userController.getUsers.bind(userController));
router.get('/users/:id', authenticateToken, userController.getUserById.bind(userController));
router.post('/users', authenticateToken, userController.createUser.bind(userController));
router.put('/users/:id', authenticateToken, userController.updateUser.bind(userController));
router.delete('/users/:id', authenticateToken, userController.deleteUser.bind(userController));

router.get('/ping', async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

const secretKey = process.env.JWT_SECRET;

function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not found' });
  jwt.verify(token, secretKey as Secret, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    (req as any).requestUserId = user.userId;
    next();
  });
}

export default router;
