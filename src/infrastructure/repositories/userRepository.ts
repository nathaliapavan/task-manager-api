import { User } from '@domain/user';

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: User): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  assignTaskToUser(userId: string, taskId: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async updateUser(id: string, updatedUser: User): Promise<User | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser, id };
      return this.users[index];
    }
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < initialLength;
  }

  async assignTaskToUser(userId: string, taskId: string): Promise<User | null> {
    // TODO
    console.log('userId', userId);
    console.log('taskId', taskId);
    return null;
  }
}
