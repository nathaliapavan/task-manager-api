import { TaskEntity } from '../../infrastructure/entities/taskEntity';
import { TaskCreate } from '../../presentation/types/taskCreateRequestTypes';
import { TaskService } from '../../application/taskService';
import { CustomError } from '../../common/errors/customError';
import { InMemoryTaskRepository } from '../infrastructure/repositories/inMemoryTaskRepository';
import { InMemoryUserRepository } from '../infrastructure/repositories/inMemoryUserRepository';

describe('TaskService', () => {
  let taskService: TaskService;
  let userRepository: InMemoryUserRepository;
  let taskRepository: InMemoryTaskRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository, userRepository);
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        {
          title: 'Test Task',
          description: 'This is a test task',
          assignedToId: 'assignedUserId',
        },
      ].map((userData) => TaskEntity.createTask('createdById', new TaskCreate(userData)));
      for (const task of mockTasks) {
        await taskRepository.createTask(task);
      }
      const { tasks, totalTasks } = await taskService.getTasks({
        page: 1,
        pageSize: 10,
        startIndex: 0,
      });
      expect(tasks).toEqual(mockTasks);
      expect(tasks.length).toEqual(1);
      expect(totalTasks).toEqual(1);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', async () => {
      const mockTasks = [
        {
          title: 'Test Task',
          description: 'This is a test task',
          assignedToId: 'assignedUserId',
        },
      ].map((taskData) => TaskEntity.createTask('createdById', new TaskCreate(taskData)));
      for (const task of mockTasks) {
        await taskRepository.createTask(task);
      }
      const result = await taskService.getTaskById(mockTasks[0].id as any);
      expect(result?.title).toEqual('Test Task');
      expect(result?.description).toEqual('This is a test task');
    });

    it('should return null', async () => {
      await taskRepository.createTask(
        TaskEntity.createTask(
          'createdById',
          new TaskCreate({
            title: 'Test Task',
            description: 'This is a test task',
            assignedToId: 'assignedUserId',
          }),
        ),
      );
      const result = await taskService.getTaskById('id' as any);
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should return true if the user was deleted', async () => {
      const mockTask = TaskEntity.createTask(
        'createdById',
        new TaskCreate({
          title: 'Test Task',
          description: 'This is a test task',
          assignedToId: 'assignedUserId',
        }),
      );
      await taskRepository.createTask(mockTask);
      await taskService.deleteTask(mockTask.id as string);
      const result = await taskRepository.getTaskById(mockTask.id as string);
      expect(result).toBeNull();
    });
  });
});
