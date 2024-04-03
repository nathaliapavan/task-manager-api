import { IUserRepository } from '@infrastructure/repositories/userRepository';
import jwt, { Secret } from 'jsonwebtoken';
import { comparePasswords } from '../common/helpers/passwordHelper';

export interface IAuthService {
  authenticate(email: string, password: string): Promise<string>;
}

export class AuthService implements IAuthService {
  private secretKey = process.env.JWT_SECRET;

  constructor(private userRepository: IUserRepository) {}

  public async authenticate(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Unauthorized' };
    }
    const isPasswordValid = comparePasswords(password, user.password as string);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Unauthorized' };
    }
    return jwt.sign({ userId: user.id }, this.secretKey as Secret, { expiresIn: '1h' });
  }
}
