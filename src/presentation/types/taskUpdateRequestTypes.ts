import { CustomError } from '../../common/errors/customError';

export interface TaskUpdateRequestBody {
  title?: string;
  description?: string;
  assignedToId?: string | undefined;
  status?: string | null;
}

export class TaskUpdate {
  title: string | null;
  description: string | null;
  assignedToId: string | undefined;
  status: string | null;

  constructor(public data: TaskUpdateRequestBody) {
    this.title = data.title || null;
    this.description = data.description || null;
    if (data.assignedToId !== undefined) {
      this.assignedToId = data.assignedToId;
    }
    this.status = data.status || null;
    this.validate();
  }

  private validate(): void {
    const { title, description, assignedToId } = this.data;
    // validar se nao tem nenhum atributo pra atualizar
    // if (!title && !description && !assignedToId) {
    //   throw new CustomError('Title or Description are required', 400);
    // }
  }
}
