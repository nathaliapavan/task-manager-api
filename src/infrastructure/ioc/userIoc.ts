import { UserService } from '../../application/userService';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { UserController } from '../../presentation/controllers/userController';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userController };
