import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "../enums/payment-method.enum";
import { PaymentType } from "../enums/payment-type.enum";
import { Bill } from "src/features/bill/entities/bill.entity";

@Entity('transaction')
export class Transaction{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'decimal'})
    receivedAmount: string;

    @Column({type: 'decimal', nullable: true})
    returnAmount: string | null;

    @Column({type: 'enum', enum:PaymentMethod })
    method: PaymentMethod;

    @Column({type: 'enum', enum:PaymentType})
    type: PaymentType;

    @ManyToOne(()=> Bill)
    bill: Bill;


}
