import { CustomError } from '../../common/errors/customError';

export interface UserUpdateRequestBody {
  name: string;
}

export class UserUpdate {
  constructor(public data: { name: string }) {
    this.validate();
  }

  private validate(): void {
    const { name } = this.data;
    if (!name) {
      throw new CustomError('Name is required', 400);
    }
  }
}
