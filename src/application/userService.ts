import { User } from '@domain/user';
import { IUserRepository } from '@infrastructure/repositories/userRepository';
import { UserCreateRequestBody } from '@presentation/types/userCreateRequestTypes';
import { UserUpdateRequestBody } from '@presentation/types/userUpdateRequestTypes';
import { v4 as uuidv4 } from 'uuid';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: User): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  assignTaskToUser(userId: string, taskId: string): Promise<User | null>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async createUser(userData: UserCreateRequestBody): Promise<User> {
    const user: User = { ...userData, id: uuidv4() };
    return this.userRepository.createUser(user);
  }

  async updateUser(id: string, userData: UserUpdateRequestBody): Promise<User | null> {
    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) return null;
    const updatedUser: User = {
      id: existingUser.id,
      name: userData.name ?? existingUser.name,
      email: existingUser.email,
    };
    return this.userRepository.updateUser(id, updatedUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }

  async assignTaskToUser(userId: string, taskId: string): Promise<User | null> {
    return this.userRepository.assignTaskToUser(userId, taskId);
  }
}
