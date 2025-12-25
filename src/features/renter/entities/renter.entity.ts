import { TimeStampedEntity } from 'src/common/entities/base-timestampz.entity';
import { ElectricityMeter } from 'src/features/property/entities/electricity-meter.entity';
import { Property } from 'src/features/property/entities/property.entity';
import { User } from 'src/features/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RenterStatus } from '../enums/renter-status.enum';
import { ContactNumber } from './contact-number.entity';
import { RenterDocument } from './renter-document.entity';
import { RenterPricing } from './renter-pricing.entity';

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

  @Column({ type: 'boolean', default: true })
  setGlobalPrice: boolean;

  @OneToOne(() => RenterPricing, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'pricing_id' })
  pricing: RenterPricing | null;

  @ManyToOne(()=> ElectricityMeter)
  electricityMeter: ElectricityMeter;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Property)
  property: Property;
}
