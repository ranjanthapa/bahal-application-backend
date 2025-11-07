import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('renter_pricing')
export class RenterPricing {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rentPerRoom: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  waterRate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  electricityRate: string;
}
