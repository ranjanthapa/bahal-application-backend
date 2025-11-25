import { Renter } from 'src/features/renter/entities/renter.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillStatus } from '../enums/bill-status.enum';
import { User } from 'src/features/user/entities/user.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalRoomRent: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalElectricityAmount: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityAmountPerUnit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalElectricityConsumed: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  waterAmount: string;

  @Column({ type: 'date' })
  billingDate: Date;

  @Column({ type: 'varchar', length: 250, nullable: true })
  note: string | null;

  @Column({ type: 'enum', enum: BillStatus })
  status: BillStatus;

  @Column({ type: 'jsonb', nullable: true })
  otherCharges: object | null;

  @ManyToOne(() => Renter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'renter_id' })
  renter: Renter;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;
}
