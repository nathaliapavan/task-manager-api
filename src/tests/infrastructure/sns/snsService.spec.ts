
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SNSService } from '../../../infrastructure/sns/snsService';

jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  PublishCommand: jest.fn(),
}));

describe('SNSService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send message successfully', async () => {
    const snsService = new SNSService();
    const message = { key: 'value' };

    process.env.SNS_REGION = 'us-east-1';
    process.env.ACCESS_KEY_ID = 'mock-access-key';
    process.env.SECRET_ACCESS_KEY = 'mock-secret-key';
    process.env.SNS_TOPIC_ARN = 'mock-topic-arn';

    await snsService.send(message);

    expect(SNSClient).toHaveBeenCalledTimes(1);
    expect(PublishCommand).toHaveBeenCalledWith({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
    });
    expect(snsService['snsClient'].send).toHaveBeenCalledWith(expect.any(PublishCommand));
  });

  it('should throw error when message sending fails', async () => {
    const snsService = new SNSService();
    const message = { key: 'value' };
    const mockError = new Error('Mock error');

    process.env.SNS_REGION = 'us-east-1';
    process.env.ACCESS_KEY_ID = 'mock-access-key';
    process.env.SECRET_ACCESS_KEY = 'mock-secret-key';
    process.env.SNS_TOPIC_ARN = 'mock-topic-arn';

    (snsService['snsClient'].send as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(snsService.send(message)).rejects.toThrowError(mockError);

    expect(SNSClient).toHaveBeenCalledTimes(1);
    expect(PublishCommand).toHaveBeenCalledWith({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
    });
    expect(snsService['snsClient'].send).toHaveBeenCalledWith(expect.any(PublishCommand));
  });
});
