import { Module } from '@nestjs/common';
import { BillController } from './controllers/bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Renter } from '../renter/entities/renter.entity';
import { RenterModule } from '../renter/renter.module';
import { BillService } from './services/bill.service';

@Module({
    imports: [TypeOrmModule.forFeature([Bill, Renter]), RenterModule],
    controllers: [BillController],
    providers: [BillService],
    exports: [BillService]
})
export class BillModule {}
