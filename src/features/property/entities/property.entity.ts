import { TimeStampedEntity } from 'src/common/entities/base-timestampz.entity';
import { User } from 'src/features/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('properties')
export class Property extends TimeStampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rentPerRoom: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2})
  waterRate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityRate: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string | null;

  @Column({ type: 'int', nullable: true })
  numberOfFloor: number;

  @Column({ type: 'int', nullable: true })
  roomsPerFloor: number;
}
