import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { UserEntity } from './userEntity';
import { TaskCreate } from '@presentation/types/taskCreateRequestTypes';
import { v4 as uuidv4 } from 'uuid';
import { TaskUpdate } from '@presentation/types/taskUpdateRequestTypes';

@Entity('tasks')
export class TaskEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar' })
  id: string | undefined;

  @Column({ name: 'title', type: 'varchar' })
  title: string | undefined;

  @Column({ name: 'description', type: 'varchar' })
  description: string | undefined;

  @Column({ name: 'status', type: 'enum', enum: ['pending', 'in_progress', 'completed'], default: 'pending' })
  status: string | undefined;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: UserEntity | undefined;

  @Column({ name: 'assigned_to_id', type: 'varchar', nullable: true })
  assignedToId!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity | undefined;

  @Column({ name: 'created_by_id', type: 'varchar', nullable: true })
  createdById: string | undefined;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date | undefined;

  @BeforeInsert()
  private setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  private setUpdatedAt() {
    this.updatedAt = new Date();
  }

  static createTask(createdById: string, taskToCreate: TaskCreate): TaskEntity {
    const task = new TaskEntity();
    task.id = uuidv4();
    task.title = taskToCreate.data.title;
    task.description = taskToCreate.data.description;
    task.createdById = createdById;
    task.assignedToId = taskToCreate.data.assignedToId || null;
    task.setCreatedAt();
    task.setUpdatedAt();
    return task;
  }

  static updateTask(existingTask: TaskEntity, taskToUpdate: TaskUpdate): TaskEntity {
    const updatedTask = new TaskEntity();
    updatedTask.id = existingTask.id;
    updatedTask.title = taskToUpdate.data.title || existingTask.title;
    updatedTask.description = taskToUpdate.data.description || existingTask.description;
    updatedTask.status = taskToUpdate.data.status || existingTask.status;
    updatedTask.createdAt = existingTask.createdAt;
    updatedTask.assignedToId =
      taskToUpdate.data.assignedToId !== undefined ? taskToUpdate.data.assignedToId : existingTask.assignedToId;
    updatedTask.createdById =
      taskToUpdate.data.createdById !== undefined ? taskToUpdate.data.createdById : existingTask.createdById;
    updatedTask.setUpdatedAt();
    return updatedTask;
  }
}
