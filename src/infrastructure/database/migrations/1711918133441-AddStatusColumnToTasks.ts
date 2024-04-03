import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusColumnToTasks1711918133441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tasks',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['pending', 'in_progress', 'completed'],
        default: "'pending'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tasks', 'status');
  }
}
