import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Renter } from './renter.entity';

@Entity('contact_numbers')
export class ContactNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  primaryNumber: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  secondaryNumber: string | null;

  // @OneToOne(() => Renter, (renter) => renter.contactNumbers, {
  //   onDelete: 'CASCADE',
  // })
  // renter: Renter;
}
