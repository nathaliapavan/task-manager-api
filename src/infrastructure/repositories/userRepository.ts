import { UserEntity } from '../entities/userEntity';
import { getRepository } from 'typeorm';

export interface IUserRepository {
  getAllUsers(): Promise<UserEntity[]>;
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity | null>;
  updateUser(user: UserEntity): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async getAllUsers(): Promise<UserEntity[]> {
    return getRepository(UserEntity).find();
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return getRepository(UserEntity).findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return getRepository(UserEntity).findOne({ where: { email } });
  }

  async updateUser(user: UserEntity): Promise<UserEntity | null> {
    return getRepository(UserEntity).save(user);
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await getRepository(UserEntity).delete(id);
    return !!deleted.affected;
  }

  async createUser(user: UserEntity): Promise<UserEntity | any> {
    return getRepository(UserEntity).save(user);
  }
}
