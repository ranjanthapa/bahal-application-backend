import { TimeStampedEntity } from 'src/common/entities/base-timestampz.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Property extends TimeStampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'string', length: 50 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rentPerRoom: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  waterRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityRate: number;

  @Column({ type: 'string', nullable: true })
  picture: string;

  @Column({ nullable: true })
  numberOfFloor: number;

  @Column({ nullable: true })
  roomsPerFloor: number;
}
