import express from 'express';
import { taskController } from '../../infrastructure/ioc/taskIoc';
import { userController } from '../../infrastructure/ioc/userIoc';
import PingController from '../controllers/pingController';

const router = express.Router();

router.get('/tasks', taskController.getAllTasks.bind(taskController));
router.get('/tasks/:id', taskController.getTaskById.bind(taskController));
router.post('/tasks', taskController.createTask.bind(taskController));
router.put('/tasks/:id', taskController.updateTask.bind(taskController));
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController));

router.get('/users', userController.getUsers.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.post('/users', userController.createUser.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));

router.get('/ping', async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

export default router;
