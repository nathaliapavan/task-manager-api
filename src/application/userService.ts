import { User } from '@domain/user';
import { UserEntity } from '../infrastructure/entities/userEntity';
import { IUserRepository } from '@infrastructure/repositories/userRepository';
import { UserCreate, UserCreateRequestBody } from '../presentation/types/userCreateRequestTypes';
import { UserUpdate, UserUpdateRequestBody } from '../presentation/types/userUpdateRequestTypes';
import { CustomError } from '../common/errors/customError';

export interface IUserService {
  getAllUsers(): Promise<UserEntity[]>;
  getUserById(id: string): Promise<UserEntity | null>;
  createUser(user: User): Promise<UserEntity | null>;
  updateUser(id: string, user: UserUpdateRequestBody): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.getUserById(id);
  }

  async createUser(userData: UserCreateRequestBody): Promise<UserEntity | null> {
    const userCreate = new UserCreate(userData);
    const existingUser = await this.userRepository.getUserByEmail(userCreate.data.email);
    if (existingUser) {
      console.error(`The email is already in use ${userCreate.data.email}`);
      throw new CustomError('An error occurred while processing your request', 500);
    }
    const user = UserEntity.createUser(new UserCreate(userData));
    return this.userRepository.createUser(user);
  }

  async updateUser(id: string, userData: UserUpdateRequestBody): Promise<UserEntity | null> {
    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) return null;
    const userUpdate = new UserUpdate(userData);
    const user = UserEntity.updateUser(existingUser, userUpdate);
    return this.userRepository.updateUser(user);
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteUser(id);
    return !!deleted;
  }
}
