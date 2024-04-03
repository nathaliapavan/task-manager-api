import { TaskEntity } from '../entities/taskEntity';
import { UserEntity } from '../entities/userEntity';
import { ConnectionOptions, createConnection } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'my_database',
  synchronize: false,
  logging: true,
  entities: [UserEntity, TaskEntity],
  migrations: [`${__dirname}/migrations/*.{js,ts}`],
};

export async function connectDatabase() {
  try {
    const connection = await createConnection(connectionOptions);
    await connection.runMigrations();
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}
