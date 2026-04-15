import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'tasks',
  paranoid: true, // Enables soft delete (deletedAt)
  timestamps: true,
})
export class Task extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM('OPEN', 'IN_PROGRESS', 'DONE'),
    defaultValue: 'OPEN',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;
}
