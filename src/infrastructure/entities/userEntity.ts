import { UserCreate } from '@presentation/types/userCreateRequestTypes';
import { UserUpdate } from '@presentation/types/userUpdateRequestTypes';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ type: 'varchar' })
  name: string | undefined;

  @Column({ type: 'varchar' })
  email: string | undefined;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date = new Date();

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date = new Date();

  @BeforeInsert()
  private setCreatedAt() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  private setUpdatedAt() {
    this.updated_at = new Date();
  }

  static createUser(userToCreate: UserCreate): UserEntity {
    const user = new UserEntity();
    user.id = uuidv4();
    user.name = userToCreate.data.name;
    user.email = userToCreate.data.email;
    user.setCreatedAt();
    user.setUpdatedAt();
    return user;
  }

  static updateUser(existingUser: UserEntity, userToUpdate: UserUpdate): UserEntity {
    const updatedUser = new UserEntity();
    updatedUser.id = existingUser.id;
    updatedUser.name = userToUpdate.data.name;
    updatedUser.email = existingUser.email;
    updatedUser.created_at = existingUser.created_at;
    updatedUser.setUpdatedAt();
    return updatedUser;
  }
}
