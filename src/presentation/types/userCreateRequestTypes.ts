import { CustomError } from '../../common/errors/customError';

export interface UserCreateRequestBody {
  name: string;
  email: string;
}

export class UserCreate {
  constructor(public data: { name: string; email: string }) {
    this.validate();
  }

  private validate(): void {
    const { name, email } = this.data;
    if (!name || !email) {
      throw new CustomError('Name and email are required', 400);
    }
    if (!this.isValidEmail(email)) {
      throw new CustomError('Invalid email format', 400);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
