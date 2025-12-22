import { TimeStampedEntity } from 'src/common/entities/base-timestampz.entity';
import { Renter } from 'src/features/renter/entities/renter.entity';
import { User } from 'src/features/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillStatus } from '../enums/bill-status.enum';
import { PaymentStatus } from 'src/features/payment/enums/payment-status.enum';

@Entity('bills')
export class Bill extends TimeStampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalRoomRent: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalElectricityCharge: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityChargePerUnit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityUnits: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityConsumed: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  waterCharge: string;

  @Column({ type: 'date' })
  billingDate: Date;

  @Column({ type: 'varchar', length: 250, nullable: true })
  note: string | null;

  @Column({ type: 'enum', enum: BillStatus })
  status: BillStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column({ type: 'jsonb', nullable: true })
  otherCharges: object | null;

  @ManyToOne(() => Renter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'renter_id' })
  renter: Renter;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;
}
