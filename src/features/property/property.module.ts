import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenterModule } from '../renter/renter.module';
import { PropertyController } from './controllers/property.controller';
import { Property } from './entities/property.entity';
import { PropertyService } from './services/property.service';
import { ElectricityMeter } from './entities/electricity-meter.entity';
import { ElectricityMeterService } from './services/electricity-meter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, ElectricityMeter]),
    RenterModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService, ElectricityMeterService],
  exports: [PropertyService, ElectricityMeterService],
})
export class PropertyModule {}
