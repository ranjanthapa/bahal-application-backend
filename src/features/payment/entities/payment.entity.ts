import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentType } from '../enums/payment-type.enum';
import { Bill } from 'src/features/bill/entities/bill.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  receivedAmount: string;

  @Column({ type: 'decimal', nullable: true })
  returnAmount: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'varchar', length: 250, nullable: true })
  note: string | null;

  @ManyToOne(() => Bill)
  bill: Bill;
}
