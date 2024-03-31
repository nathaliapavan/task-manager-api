import PingController from '../../../presentation/controllers/pingController';

describe('PingController', () => {
  it('should return pong message', async () => {
    const controller = new PingController();
    const response = await controller.getMessage();
    expect(response.message).toBe('pong');
  });
});
