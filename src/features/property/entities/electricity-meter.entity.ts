import { Property } from 'src/features/property/entities/property.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MeterState } from '../enums/meter-state.enum';

@Entity('electricity_meter')
export class ElectricityMeter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  meterName: string;

  @Column({ type: 'int' })
  previouseMonthUnit: number;

  @Column({ type: 'date' })
  previousUnitDate: Date;

  @Column({ type: 'enum', enum: MeterState, default: MeterState.INACTIVE })
  state: MeterState;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Property)
  property: Property;
}
