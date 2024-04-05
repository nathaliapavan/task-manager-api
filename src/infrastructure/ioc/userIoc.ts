import { UserService } from '../../application/userService';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { UserController } from '../../presentation/controllers/userController';
import { EmailNotificationService } from '../../infrastructure/notification/emailNotificationService';
import { SNSService } from '../sns/snsService';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const snsService = new SNSService();
const emailNotificationService = new EmailNotificationService(snsService);
userService.addObserver(emailNotificationService);

export { userController };
