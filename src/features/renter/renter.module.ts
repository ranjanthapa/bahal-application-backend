import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Renter } from './entities/renter.entity';
import { RenterDocument } from './entities/renter-document.entity';
import { ContactNumber } from './entities/contact-number.entity';
import { RenterController } from './controllers/renter.controller';
import { RenterService } from './services/renter.service';
import { RenterPricing } from './entities/renter-pricing.entity';
import { PropertyModule } from '../property/property.module';
import { Property } from '../property/entities/property.entity';
import { ElectricityMeterService } from '../property/services/electricity-meter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Renter,
      RenterDocument,
      ContactNumber,
      RenterPricing,
      Property,
    ]),
    PropertyModule
  ],
  controllers: [RenterController],
  providers: [RenterService],
  exports: [RenterService],
})
export class RenterModule {}
