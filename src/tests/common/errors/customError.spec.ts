import { CustomError } from '../../../common/errors/customError';

describe('CustomError', () => {
  it('should create an instance of CustomError', () => {
    const error = new CustomError('Test error', 404);
    expect(error instanceof CustomError).toBeTruthy();
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(404);
  });

  it('should have correct name and stack trace', () => {
    const error = new CustomError('Test error', 404);
    expect(error.name).toBe('CustomError');
    expect(error.stack).toBeDefined();
  });
});
