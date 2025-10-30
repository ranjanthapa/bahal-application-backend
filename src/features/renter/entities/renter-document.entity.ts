import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Renter } from './renter.entity';

@Entity('documents')
export class RenterDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  citizenshipFront: string | null;

  @Column({ type: 'varchar', nullable: true })
  citizenshipBack: string | null;

  @OneToOne(() => Renter, (renter) => renter.documents, { onDelete: 'CASCADE' })
  renter: Renter;
}
