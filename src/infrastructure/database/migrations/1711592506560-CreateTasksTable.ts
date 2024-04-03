import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateTasksTable1711592506560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'title', type: 'varchar', isNullable: false },
          { name: 'description', type: 'varchar', isNullable: false },
          { name: 'created_by_id', type: 'varchar', isNullable: false },
          { name: 'assigned_to_id', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['assigned_to_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tasks',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskTable = await queryRunner.getTable('tasks');
    const assignedToForeignKey = taskTable?.foreignKeys.find((fk) => fk.columnNames.indexOf('assigned_to_id') !== -1);
    const createdByForeignKey = taskTable?.foreignKeys.find((fk) => fk.columnNames.indexOf('created_by_id') !== -1);

    await queryRunner.dropForeignKey('tasks', assignedToForeignKey ?? '');
    await queryRunner.dropForeignKey('tasks', createdByForeignKey ?? '');

    await queryRunner.dropColumn('tasks', 'assigned_to_id');
    await queryRunner.dropColumn('tasks', 'created_by_id');
    await queryRunner.dropTable('tasks');
  }
}
