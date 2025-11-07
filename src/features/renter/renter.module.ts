import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Renter } from './entities/renter.entity';
import { RenterDocument } from './entities/renter-document.entity';
import { ContactNumber } from './entities/contact-number.entity';
import { RenterController } from './controllers/renter.controller';
import { RenterService } from './services/renter.service';
import { RenterPricing } from './entities/renter-pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Renter, RenterDocument, ContactNumber, RenterPricing])],
  controllers: [RenterController],
  providers: [RenterService],
})
export class RenterModule {}
