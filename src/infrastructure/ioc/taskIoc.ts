import { TaskService } from '@application/task/taskService';
import { TaskController } from '@presentation/controllers/taskController';
import { TaskRepository } from '@infrastructure/repositories/taskRepository';

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

export { taskController };
