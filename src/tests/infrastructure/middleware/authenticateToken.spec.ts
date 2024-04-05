import { authenticateToken } from '../../../infrastructure/middleware/autenticateToken';
import { Request, Response } from 'express';
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn();

describe('authenticateToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if token is not provided', () => {
    const mockRequestWithToken = {
      headers: { authorization: null },
    } as unknown as Request;

    authenticateToken(mockRequestWithToken, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token not found' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    const mockRequestWithToken = {
      headers: { authorization: 'Bearer invalidToken' },
    } as unknown as Request;

    authenticateToken(mockRequestWithToken, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
