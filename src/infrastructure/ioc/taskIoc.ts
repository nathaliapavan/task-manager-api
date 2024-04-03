import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { TaskService } from '../../application/taskService';
import { TaskRepository } from '../../infrastructure/repositories/taskRepository';
import { TaskController } from '../../presentation/controllers/taskController';

const taskRepository = new TaskRepository();
const userRepository = new UserRepository();
const taskService = new TaskService(taskRepository, userRepository);
const taskController = new TaskController(taskService);

export { taskController };
