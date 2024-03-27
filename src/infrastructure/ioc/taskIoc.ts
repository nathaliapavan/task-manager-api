import { TaskService } from '../../application/taskService';
import { TaskRepository } from '../../infrastructure/repositories/taskRepository';
import { TaskController } from '../../presentation/controllers/taskController';

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

export { taskController };
