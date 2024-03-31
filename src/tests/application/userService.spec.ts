import { InMemoryUserRepository } from '../infrastructure/repositories/inMemoryUserRepository';
import { UserEntity } from '../../infrastructure/entities/userEntity';
import { UserCreate } from '../../presentation/types/userCreateRequestTypes';
import { UserService } from '../../application/userService';
import { CustomError } from '../../common/errors/customError';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
      ].map((userData) => UserEntity.createUser(new UserCreate(userData)));
      for (const user of mockUsers) {
        await userRepository.createUser(user);
      }
      const result = await userService.getAllUsers();
      expect(result).toEqual(mockUsers);
      expect(result.length).toEqual(2);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUsers = [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
      ].map((userData) => UserEntity.createUser(new UserCreate(userData)));
      for (const user of mockUsers) {
        await userRepository.createUser(user);
      }
      const result = await userService.getUserById(mockUsers[0].id as any);
      expect(result?.name).toEqual('User 1');
      expect(result?.email).toEqual('user1@example.com');
    });

    it('should return null', async () => {
      await userRepository.createUser(
        UserEntity.createUser(new UserCreate({ name: 'User 1', email: 'user1@example.com' })),
      );
      const result = await userService.getUserById('id' as any);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      await userService.createUser(userData);
      const result = await userRepository.getAllUsers();
      expect(result[0]?.name).toEqual(userData.name);
      expect(result[0]?.email).toEqual(userData.email);
    });

    it('should throw error if email is already in use', async () => {
      const mockUser = UserEntity.createUser(new UserCreate({ name: 'User 1', email: 'user1@example.com' }));
      await userRepository.createUser(mockUser);
      const userData = {
        name: 'John Doe',
        email: 'user1@example.com',
      };
      await expect(userService.createUser(userData)).rejects.toThrowError(
        new CustomError('An error occurred while processing your request', 500),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateData = { name: 'New Name' };
      const mockUser = UserEntity.createUser(new UserCreate({ name: 'User 1', email: 'user1@example.com' }));
      await userRepository.createUser(mockUser);
      await userService.updateUser(mockUser.id as string, updateData);
      const result = await userRepository.getUserById(mockUser.id as string);
      expect(result?.name).toEqual(updateData.name);
    });

    it("should throw an error if it doesn't have a name", async () => {
      const userData = {};
      userRepository.updateUser = jest.fn();
      userRepository.getUserById = jest.fn().mockResolvedValue(userData);
      await expect(userService.updateUser('id', userData as any)).rejects.toThrowError(
        new CustomError('Name is required', 400),
      );
      expect(userRepository.updateUser).not.toHaveBeenCalled();
    });

    it('should throw error if user does not exist', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      userRepository.updateUser = jest.fn();
      userRepository.getUserById = jest.fn().mockResolvedValue(null);
      await userService.updateUser('id', userData);
      expect(userRepository.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should return false if the user was not deleted', async () => {
      const result = await userService.deleteUser('id');
      expect(result).toBeFalsy();
    });

    it('should return true if the user was deleted', async () => {
      const mockUser = UserEntity.createUser(new UserCreate({ name: 'User 1', email: 'user1@example.com' }));
      await userRepository.createUser(mockUser);
      await userService.deleteUser(mockUser.id as string);
      const result = await userRepository.getUserById(mockUser.id as string);
      expect(result).toBeNull();
    });
  });
});
