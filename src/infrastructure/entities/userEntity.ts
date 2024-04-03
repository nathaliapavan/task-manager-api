import { UserCreate } from '@presentation/types/userCreateRequestTypes';
import { UserUpdate } from '@presentation/types/userUpdateRequestTypes';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TaskEntity } from './taskEntity';
import { generateRandomPassword } from '../../common/helpers/passwordHelper';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ type: 'varchar' })
  name: string | undefined;

  @Column({ type: 'varchar' })
  email: string | undefined;

  @Column({ type: 'varchar' })
  password: string | undefined;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date = new Date();

  @BeforeInsert()
  private setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  private setUpdatedAt() {
    this.updatedAt = new Date();
  }

  // @OneToMany(() => TaskEntity, (task) => task.assignedTo)
  // tasks: TaskEntity[] | undefined;

  static createUser(userToCreate: UserCreate): UserEntity {
    const user = new UserEntity();
    user.id = uuidv4();
    user.name = userToCreate.data.name;
    user.email = userToCreate.data.email;
    user.password = generateRandomPassword();
    user.setCreatedAt();
    user.setUpdatedAt();
    return user;
  }

  static updateUser(existingUser: UserEntity, userToUpdate: UserUpdate): UserEntity {
    const updatedUser = new UserEntity();
    updatedUser.id = existingUser.id;
    updatedUser.name = userToUpdate.data.name;
    updatedUser.email = existingUser.email;
    updatedUser.createdAt = existingUser.createdAt;
    updatedUser.setUpdatedAt();
    return updatedUser;
  }
}
