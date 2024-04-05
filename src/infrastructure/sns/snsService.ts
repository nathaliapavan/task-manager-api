import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

interface ISNSService {
  send(message: any): Promise<any>;
}

export class SNSService implements ISNSService {
  async send(message: any): Promise<any> {
    const snsClient = new SNSClient({
      region: process.env.SNS_REGION || '',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
      },
    });
    const params = {
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
    };
    try {
      await snsClient.send(new PublishCommand(params));
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
