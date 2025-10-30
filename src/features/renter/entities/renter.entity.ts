import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/features/user/entities/user.entity';
import { ContactNumber } from './contact-number.entity';
import { RenterDocument } from './renter-document.entity';
import { RenterStatus } from '../enums/renter-status.enum';
import { TimeStampedEntity } from 'src/common/entities/base-timestampz.entity';

@Entity('renters')
export class Renter extends TimeStampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250 })
  fullName: string;

  @OneToOne(() => ContactNumber, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  contactNumbers: ContactNumber;

  @OneToOne(() => RenterDocument, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  documents: RenterDocument;

  @Column({ type: 'date' })
  joinedOn: Date;

  @Column({ type: 'varchar' })
  picture: string;

  @Column({ type: 'enum', enum: RenterStatus, default: RenterStatus.ACTIVE })
  status: RenterStatus;

  @Column({ type: 'int' })
  numberOfRooms: number;

  @ManyToOne(() => User)
  owner: User;
}
