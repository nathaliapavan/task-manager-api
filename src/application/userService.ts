import { User } from '@domain/user';
import { UserEntity } from '../infrastructure/entities/userEntity';
import { IUserRepository } from '@infrastructure/repositories/userRepository';
import { UserCreate, UserCreateRequestBody } from '../presentation/types/userCreateRequestTypes';
import { UserUpdate, UserUpdateRequestBody } from '../presentation/types/userUpdateRequestTypes';
import { CustomError } from '../common/errors/customError';
import { UserQuery } from '../presentation/controllers/userController';
import { NotifyObserver } from '../infrastructure/notification/emailNotificationService';

export interface UsersData {
  users: UserEntity[];
  totalUsers: number;
}

export interface IUserService {
  getUsers(params: UserQuery): Promise<UsersData>;
  getUserById(id: string): Promise<UserEntity | null>;
  createUser(user: User): Promise<UserEntity | null>;
  updateUser(id: string, user: UserUpdateRequestBody): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserService implements IUserService {
  private notifyObserver: NotifyObserver[] = [];

  constructor(private userRepository: IUserRepository) {}

  addObserver(observer: NotifyObserver) {
    this.notifyObserver.push(observer);
  }

  private async notifyObservers(data: any) {
    await Promise.all(this.notifyObserver.map((observer) => observer.verifyEmailNotification(data)));
  }

  async getUsers(params: UserQuery): Promise<UsersData> {
    const [users, totalUsers] = await Promise.all([
      this.userRepository.getUsers(params),
      this.userRepository.countUsers(params),
    ]);
    return { users, totalUsers };
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.getUserById(id);
    delete user?.password;
    return user;
  }

  async createUser(userData: UserCreateRequestBody): Promise<UserEntity | null> {
    const userCreate = new UserCreate(userData);
    const existingUser = await this.userRepository.getUserByEmail(userCreate.data.email);
    if (existingUser) {
      console.error(`The email is already in use ${userCreate.data.email}`);
      throw new CustomError('An error occurred while processing your request', 500);
    }
    const user = UserEntity.createUser(new UserCreate(userData));
    const createdUser = await this.userRepository.createUser(user);
    if (createdUser) this.notifyObservers(createdUser);
    delete createdUser?.password;
    return createdUser;
  }

  async updateUser(id: string, userData: UserUpdateRequestBody): Promise<UserEntity | null> {
    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) return null;
    const userUpdate = new UserUpdate(userData);
    const user = UserEntity.updateUser(existingUser, userUpdate);
    const updatedUser = await this.userRepository.updateUser(user);
    delete updatedUser?.password;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteUser(id);
    return !!deleted;
  }
}
