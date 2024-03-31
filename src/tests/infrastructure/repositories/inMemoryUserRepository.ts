import { IUserRepository } from '../../../infrastructure/repositories/userRepository';
import { UserEntity } from '../../../infrastructure/entities/userEntity';

export class InMemoryUserRepository implements IUserRepository {
  private users: UserEntity[] = [];

  async getAllUsers(): Promise<UserEntity[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async updateUser(user: UserEntity): Promise<UserEntity | null> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return user;
    }
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length !== initialLength;
  }

  async createUser(user: UserEntity): Promise<any> {
    this.users.push(user);
    return this.getUserById(user.id as any);
  }
}
