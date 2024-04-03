import { CustomError } from '../../common/errors/customError';

export interface TaskCreateRequestBody {
  title: string;
  description: string;
  assignedToId: string;
}

export class TaskCreate {
  constructor(public data: { title: string; description: string; assignedToId: string }) {
    this.validate();
  }

  private validate(): void {
    const { title, description } = this.data;
    if (!title) {
      throw new CustomError('Title is required', 400);
    }

    if (!description) {
      throw new CustomError('Description is required', 400);
    }
  }
}
