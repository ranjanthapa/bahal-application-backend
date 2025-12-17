import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../property/entities/property.entity';
import { RenterController } from './controllers/renter.controller';
import { ContactNumber } from './entities/contact-number.entity';
import { RenterDocument } from './entities/renter-document.entity';
import { RenterPricing } from './entities/renter-pricing.entity';
import { Renter } from './entities/renter.entity';
import { RenterService } from './services/renter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Renter,
      RenterDocument,
      ContactNumber,
      RenterPricing,
      Property,
    ]),
    
  ],
  controllers: [RenterController],
  providers: [RenterService],
  exports: [RenterService],
})
export class RenterModule {}
