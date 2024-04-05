import { SNSService } from '@infrastructure/sns/snsService';

enum EMAIL_NOTIFICATION_TYPE {
  VERIFY_EMAIL = 'verify_email',
  CHANGE_TASK = 'change_task',
}

type SEND_EMAIL_CONFIRMATION = {
  typeNotification: EMAIL_NOTIFICATION_TYPE;
  email: string;
};

export interface NotifyUserObserver {
  sendEmailConfirmation(data: any): void;
}

export class EmailNotificationService implements NotifyUserObserver {
  private snsService: SNSService;

  constructor(httpAdapter: SNSService) {
    this.snsService = httpAdapter;
  }

  async sendEmailConfirmation(data: SEND_EMAIL_CONFIRMATION): Promise<void> {
    try {
      const notificationData = {
        typeNotification: EMAIL_NOTIFICATION_TYPE.VERIFY_EMAIL,
        toAddress: data.email,
      };
      await this.sendNotification(notificationData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async sendNotification(notificationData: any): Promise<void> {
    try {
      const lambdaResponse = await this.snsService.send('', notificationData);
      console.log('Success in sending notification:', lambdaResponse);
    } catch (error) {
      throw new Error(`Error sending notification: ${error}`);
    }
  }
}
