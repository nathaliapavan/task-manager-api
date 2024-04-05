import { EmailNotificationService, NotifyObserver } from '../../../infrastructure/notification/emailNotificationService';
import { SNSService } from '../../../infrastructure/sns/snsService';

jest.mock('../../../infrastructure/sns/snsService', () => ({
  SNSService: jest.fn(() => ({
    send: jest.fn(),
  })),
}));

enum EMAIL_NOTIFICATION_TYPE {
  VERIFY_EMAIL = 'verify_email',
  CHANGE_TASK = 'change_task',
}

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('EmailNotificationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send verify email notification successfully', async () => {
    const snsService = new SNSService() as unknown as SNSService;
    const emailNotificationService = new EmailNotificationService(snsService);
    const notifyObserver: NotifyObserver = emailNotificationService;

    const data = {
      typeNotification: EMAIL_NOTIFICATION_TYPE.VERIFY_EMAIL,
      email: 'example@example.com',
    };

    await notifyObserver.verifyEmailNotification(data);

    expect(snsService.send).toHaveBeenCalledWith({
      typeNotification: 'verify_email',
      toAddress: data.email,
    });

    expect(mockConsoleLog).toHaveBeenCalledWith('Success in sending notification');
  });

  it('should send change task notification successfully', async () => {
    const snsService = new SNSService() as unknown as SNSService;
    const emailNotificationService = new EmailNotificationService(snsService);
    const notifyObserver: NotifyObserver = emailNotificationService;

    const data = {
      action: 'create',
      task: {
        id: 'task_id',
        title: 'Task Title',
        description: 'Task Description',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      emailsAssociatedUsers: {
        createdByEmail: 'creator@example.com',
        assignedToEmail: 'assignee@example.com',
      },
    };

    await notifyObserver.changeTaskNotification(data);

    expect(snsService.send).toHaveBeenCalledWith({
      typeNotification: 'change_task',
      createdByEmail: data.emailsAssociatedUsers.createdByEmail,
      assignedToEmail: data.emailsAssociatedUsers.assignedToEmail,
      subject: 'New Task',
      body: expect.any(String),
    });
    expect(mockConsoleLog).toHaveBeenCalledWith('Success in sending notification');
  });

  it('should throw error if sending notification fails', async () => {
    const snsService = new SNSService() as unknown as SNSService;
    const emailNotificationService = new EmailNotificationService(snsService);
    const notifyObserver: NotifyObserver = emailNotificationService;

    const mockError = new Error('Mock error');

    const data = {
      typeNotification: EMAIL_NOTIFICATION_TYPE.VERIFY_EMAIL,
      email: 'example@example.com',
    };

    (snsService.send as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(notifyObserver.verifyEmailNotification(data)).rejects.toThrowError(`Error sending notification: ${mockError}`);
  });
});
