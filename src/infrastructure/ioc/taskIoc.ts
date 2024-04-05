import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { TaskService } from '../../application/taskService';
import { TaskRepository } from '../../infrastructure/repositories/taskRepository';
import { TaskController } from '../../presentation/controllers/taskController';
import { EmailNotificationService } from '../../infrastructure/notification/emailNotificationService';
import { SNSService } from '../sns/snsService';

const taskRepository = new TaskRepository();
const userRepository = new UserRepository();
const taskService = new TaskService(taskRepository, userRepository);
const taskController = new TaskController(taskService);

const snsService = new SNSService();
const emailNotificationService = new EmailNotificationService(snsService);
taskService.addObserver(emailNotificationService);

export { taskController };
