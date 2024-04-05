import { CustomError } from '../../common/errors/customError';

export interface TaskUpdateRequestBody {
  title?: string;
  description?: string;
  assignedToId?: string | undefined;
  status?: string | null;
}

export class TaskUpdate {
  title?: string | null;
  description?: string | null;
  assignedToId?: string | undefined;
  status?: string | null;

  constructor(public data: TaskUpdateRequestBody) {
    if (data.title) {
      this.title = data.title;
    }

    if (data.description) {
      this.description = data.description;
    }

    if (data.assignedToId) {
      this.assignedToId = data.assignedToId;
    }

    if (data.status) {
      this.status = this.validateStatus(data.status);
    }
  }

  private validateStatus(status: string) {
    const statuses = ['pending', 'in_progress', 'completed'];
    const validStatus = statuses.includes(status);
    if (!validStatus) {
      throw new CustomError(`Invalid status. Available values: ${statuses.join(', ')}`, 400);
    }
    return status;
  }
}
