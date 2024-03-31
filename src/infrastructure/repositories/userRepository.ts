import { UserQuery } from '../../presentation/controllers/userController';
import { UserEntity } from '../entities/userEntity';
import { getRepository } from 'typeorm';

export interface IUserRepository {
  getUsers(params: UserQuery): Promise<UserEntity[]>;
  countUsers(params: UserQuery): Promise<number>;
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity | null>;
  updateUser(user: UserEntity): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async getUsers(params: UserQuery): Promise<UserEntity[]> {
    const queryBuilder = getRepository(UserEntity).createQueryBuilder('user')
      .skip(params.startIndex)
      .take(params.pageSize);
    
      if (params.name) {
        queryBuilder.andWhere('user.name LIKE :name', { name: `%${params.name}%` });
      }
  
      if (params.email) {
        queryBuilder.andWhere('user.email LIKE :email', { email: `%${params.email}%` });
      }
    
    return queryBuilder.getMany();
  }

  async countUsers(params: UserQuery): Promise<number> {
    const queryBuilder = getRepository(UserEntity).createQueryBuilder('user')
      .skip(params.startIndex)
      .take(params.pageSize);
    
      if (params.name) {
        queryBuilder.andWhere('user.name LIKE :name', { name: `%${params.name}%` });
      }
  
      if (params.email) {
        queryBuilder.andWhere('user.email LIKE :email', { email: `%${params.email}%` });
      }
    
    return queryBuilder.getCount();
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
