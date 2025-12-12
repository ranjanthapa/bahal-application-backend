import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenterModule } from '../renter/renter.module';
import { PropertyController } from './controllers/property.controller';
import { Property } from './entities/property.entity';
import { PropertyService } from './services/property.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), RenterModule],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
