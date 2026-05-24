import { TimeStampedEntity } from 'src/common/entities/base-timestampz.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends TimeStampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string ;      

  @Column({ length: 10, unique: true , nullable: true})
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Column({type: 'boolean', default: false})
  isVerify: boolean
}
