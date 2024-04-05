import { SNSService } from '@infrastructure/sns/snsService';

enum EMAIL_NOTIFICATION_TYPE {
  VERIFY_EMAIL = 'verify_email',
  CHANGE_TASK = 'change_task',
}

type VERIFY_EMAIL_CONFIRMATION = {
  typeNotification: EMAIL_NOTIFICATION_TYPE;
  email: string;
};

export interface NotifyObserver {
  verifyEmailNotification(data: VERIFY_EMAIL_CONFIRMATION): void;
  changeTaskNotification(data: any): void;
}

export class EmailNotificationService implements NotifyObserver {
  private snsService: SNSService;

  constructor(snsService: SNSService) {
    this.snsService = snsService;
  }

  async verifyEmailNotification(data: VERIFY_EMAIL_CONFIRMATION): Promise<void> {
    try {
      const notificationData = {
        typeNotification: EMAIL_NOTIFICATION_TYPE.VERIFY_EMAIL,
        toAddress: data.email,
      };
      await this.snsService.send(notificationData);
      console.log('Success in sending notification');
    } catch (error: any) {
      throw new Error(`Error sending notification: ${error}`);
    }
  }

  async changeTaskNotification(data: any): Promise<void> {
    try {
      const notificationData = {
        typeNotification: EMAIL_NOTIFICATION_TYPE.CHANGE_TASK,
        createdByEmail: data.emailsAssociatedUsers.createdByEmail,
        assignedToEmail: data.emailsAssociatedUsers.assignedToEmail,
        subject: this.getSubject(data.action),
        body: this.getBody(data),
      };
      await this.snsService.send(notificationData);
      console.log('Success in sending notification');
    } catch (error: any) {
      throw new Error(`Error sending notification: ${error}`);
    }
  }

  getSubject(action: string) {
    if (action === 'create') return 'New Task';
    if (action === 'update') return 'Updated Task';
    if (action === 'delete') return 'Deleted Task';
    return 'New Notification';
  }

  getBody(data: any) {
    return `
      Olá,

      Gostaríamos de informar que uma tarefa foi ${this.getAction(data)} em nosso sistema.

      Detalhes da tarefa:
      - ID: ${data.task.id}
      - Nome: ${data.task.title}
      - Descrição: ${data.task.description}
      - Status: ${this.formatStatus(data.task.status)}
      - Criada por: ${data.emailsAssociatedUsers.createdByEmail}
      - Responsável: ${data.emailsAssociatedUsers.assignedToEmail}
      - Data de criação: ${this.formatDate(data.task.createdAt)}
      - Última atualização: ${this.formatDate(data.task.updatedAt)}

      Por favor, não hesite em entrar em contato conosco se precisar de mais informações ou tiver alguma dúvida.

      Atenciosamente,
      Task Manager.
      `;
  }

  getAction(data: any) {
    let action = 'modificada';
    if (data.action === 'create') action = 'criada';
    if (data.action === 'update') action = 'atualizada';
    if (data.action === 'delete') action = 'deletada';
    return action;
  }

  formatStatus(status: string) {
    if (status === 'pending') return 'Pendente';
    if (status === 'in_progress') return 'Em andamento';
    if (status === 'completed') return 'Concluída';
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    });
  }
}
