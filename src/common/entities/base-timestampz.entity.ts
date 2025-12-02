import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimeStampedEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
